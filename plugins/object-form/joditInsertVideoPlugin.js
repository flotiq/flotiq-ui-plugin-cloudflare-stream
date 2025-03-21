import { playIcon } from './icons.js';
import {
  fetchMediaObject,
  getMediaName,
  getMediaUrl,
} from '../../common/helpers.js';
import { getVideo, saveVideo } from '../sidebar/lib/cloudflareApi.js';
import { getCachedElement } from '../../common/plugin-element-cache.js';
import { getSnippet } from '../sidebar/lib/snippetHelpers.js';

const attributeName = 'data-cloudflare-stream-widget';

async function findVideo(mediaName, apiKey, accountId, videoUrl) {
  const cfVideo = await getVideo(mediaName, apiKey, accountId);
  const response = await cfVideo.json();
  if (response.length !== 0) {
    return response[0];
  }

  const savedVideo = await saveVideo(videoUrl, mediaName, apiKey, accountId);
  return await savedVideo.json();
}

const openVideoWidgetModal = async (
  openSchemaModal,
  client,
  spaceId,
  apiUrl,
  saveSnippet,
) =>
  openSchemaModal({
    title: 'Osadź obrazek z wideo',
    size: 'lg',
    form: {
      options: {
        onSubmit: async (values, modalInstance) => {
          //@todo save video into CF

          const { apiKey, accountId, customerSubDomain, snippets } =
            getCachedElement('settings');

          try {
            const mediaObject = await fetchMediaObject(
              values.video?.[0]?.dataUrl,
              client,
            );
            const mediaName = getMediaName(spaceId, mediaObject);

            if (snippets?.[mediaName]) {
              modalInstance.resolve(snippets?.[mediaName]);
              return;
            }

            const cfVideo = await findVideo(
              mediaName,
              apiKey,
              accountId,
              getMediaUrl(apiUrl, mediaObject),
            );

            const snippet = getSnippet(customerSubDomain, cfVideo.uid);
            const newSettings = await saveSnippet(
              mediaName,
              cfVideo.uid,
              snippet,
            );

            modalInstance.resolve(newSettings.snippets[mediaName]);
          } catch (e) {
            //@todo add error handling
          }
        },
      },
      schema: {
        id: 'canews.custom-video-form', //@todo change id
        metaDefinition: {
          order: ['video'],
          propertiesConfig: {
            video: {
              label: 'Wideo',
              helpText: '',
              unique: false,
              validation: {
                relationContenttype: '_media',
              },
              inputType: 'datasource',
            },
          },
        },
        schemaDefinition: {
          additionalProperties: false,
          required: ['video'],
          type: 'object',
          allOf: [
            {
              $ref: '#/components/schemas/AbstractContentTypeSchemaDefinition',
            },
            {
              type: 'object',
              properties: {
                video: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/DataSource',
                  },
                },
              },
            },
          ],
        },
      },
    },
  });

//@todo add translations
export function initVideoModalPlugin(
  Jodit,
  openSchemaModal,
  client,
  spaceId,
  apiUrl,
  saveSnippet,
) {
  Jodit.defaultOptions.controls['custom-video'] = {
    icon: playIcon,
    tooltip: 'Osadź obrazek z wideo',
    exec: async (editor) => {
      const values = await openVideoWidgetModal(
        openSchemaModal,
        client,
        spaceId,
        apiUrl,
        saveSnippet,
      );

      console.log(values);
      //@todo open preview modal
    },
  };
}

//@todo add translations
export const imgCustomVideoPopup = {
  name: 'widget',
  icon: playIcon,
  tooltip: 'Otwórz wideo jako widżet',
  isActive: (_, selection) => {
    return !!selection.target.parentElement?.getAttribute(attributeName);
  },
  isDisabled: (_, selection) => {
    const parent = selection.target.parentElement;
    if (!parent || parent?.nodeName !== 'A' || !parent?.href) return true;
    return !parent.href.match(/.(webm|mov|mp4|m4p|m4v|avi|qt)$/);
  },
  exec: async (_, element) => {
    if (!element.parentElement) return;
    if (element.parentElement.getAttribute(attributeName)) {
      element.parentElement.removeAttribute(attributeName);
    } else {
      element.parentElement.setAttribute(attributeName, true);
    }
  },
};
