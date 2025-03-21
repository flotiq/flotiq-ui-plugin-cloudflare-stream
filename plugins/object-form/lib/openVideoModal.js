import { getCachedElement } from '../../../common/plugin-element-cache.js';
import {
  fetchMediaObject,
  getMediaName,
  getMediaUrl,
} from '../../../common/helpers.js';
import { getSnippet } from '../../sidebar/lib/snippetHelpers.js';
import findVideo from './findVideo.js';

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
    title: 'Osadź obrazek z wideo',
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

            const mediaName = getMediaName(spaceId, contentObject);

            if (snippets?.[mediaName]) {
              modalInstance.resolve({ mediaName, contentObject, ok: true });
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
              ok: true,
            });
          } catch (e) {
            console.error(e);
            modalInstance.resolve({
              mediaName: {},
              contentObject: {},
              ok: false,
            });
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
}
