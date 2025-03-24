import { getCachedElement } from '../../../common/plugin-element-cache.js';
import {
  fetchMediaObject,
  getMediaName,
  getMediaUrl,
  videoMimeTypes,
} from '../../../common/helpers.js';
import { getSnippet } from '../../sidebar/lib/snippetHelpers.js';
import findVideo from './findVideo.js';
import i18n from '../../../i18n.js';

/**
 * Open modal for picking video
 * @param {function} openSchemaModal
 * @param {object} client
 * @param {string} spaceId
 * @param {string} apiUrl
 * @param {function} saveSnippet
 * @returns {Promise<object>}
 */
export async function openVideoModal(
  openSchemaModal,
  client,
  spaceId,
  apiUrl,
  saveSnippet,
) {
  return openSchemaModal({
    title: i18n.t('joditToolTip'),
    size: 'lg',
    form: {
      options: {
        onSubmit: async (values, modalInstance) => {
          const { apiKey, accountId, customerSubDomain, snippets } =
            getCachedElement('settings');

          try {
            const contentObject = await fetchMediaObject(
              values.video?.[0]?.dataUrl,
              client,
            );

            if (!videoMimeTypes.includes(contentObject.mimeType)) {
              modalInstance.resolve({
                mediaName: {},
                contentObject: {},
                message: 'notVideoMediaWasSelected',
                ok: false,
              });
            }

            const mediaName = getMediaName(spaceId, contentObject);

            if (snippets?.[mediaName]) {
              modalInstance.resolve({
                mediaName,
                contentObject,
                message: '',
                ok: true,
              });
              return;
            }

            const cfVideo = await findVideo(
              mediaName,
              apiKey,
              accountId,
              getMediaUrl(apiUrl, contentObject),
            );

            const snippet = getSnippet(customerSubDomain, cfVideo.uid);
            await saveSnippet(mediaName, cfVideo.uid, snippet);

            modalInstance.resolve({
              mediaName,
              contentObject,
              message: '',
              ok: true,
            });
          } catch (e) {
            console.error(e);
            modalInstance.resolve({
              mediaName: {},
              contentObject: {},
              message: '',
              ok: false,
            });
          }
        },
      },
      schema: {
        id: 'flotiq-ui-cloudflare-streaming-plugin-video-picker-modal',
        metaDefinition: {
          order: ['video'],
          propertiesConfig: {
            video: {
              label: 'Video',
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
}
