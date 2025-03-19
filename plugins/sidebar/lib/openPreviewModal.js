import { schema as pluginInfo } from '../../manage/settings-schema.js';
import { getCachedElement } from '../../../common/plugin-element-cache.js';
import modal from 'inline:../../templates/modal.html';
import { buildSwitch } from './snippetHelpers.js';

const settings = ['controls', 'autoplay', 'loop', 'preload', 'muted', 'lazy'];

/**
 *
 * @param {function} openModal
 * @param mediaUrl
 * @param contentObjectId
 * @param customerSubDomain
 * @param mediaName
 * @param snippets
 * @returns {Promise<void>}
 */
export default async function openPreviewModal(
  openModal,
  mediaUrl,
  contentObjectId,
  customerSubDomain,
  snippets,
  mediaName,
) {
  const containerCacheKey = `${pluginInfo.id}-${contentObjectId}-cloudflare-stream-plugin-preview-modal`;
  let cloudflareStreamPluginPreviewModal =
    getCachedElement(containerCacheKey)?.element;

  if (!cloudflareStreamPluginPreviewModal) {
    cloudflareStreamPluginPreviewModal = document.createElement('div');
    cloudflareStreamPluginPreviewModal.classList.add(
      'flotiq-ui-plugin-cloudflare-stream-preview-modal-container',
    );

    cloudflareStreamPluginPreviewModal.innerHTML = modal;

    const snippet = snippets[mediaName];

    const previewContainer = cloudflareStreamPluginPreviewModal.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-snippet-in-modal-preview',
    );

    const snippetContainer = cloudflareStreamPluginPreviewModal.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-in-modal-snippet',
    );

    const settingsContainer = cloudflareStreamPluginPreviewModal.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-snippet-settings-container',
    );

    previewContainer.innerHTML = snippet;
    snippetContainer.textContent = snippet;

    //@todo add translations
    settingsContainer.innerHTML = settings
      .map((settingsElement) => buildSwitch(settingsElement))
      .join('');
  }

  const result = await openModal({
    title: 'Video settings',
    size: '3xl',
    content: cloudflareStreamPluginPreviewModal,
    hideClose: true,
  });
}
