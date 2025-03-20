import { schema as pluginInfo } from '../../manage/settings-schema.js';
import { getCachedElement } from '../../../common/plugin-element-cache.js';
import modal from 'inline:../../templates/modal.html';
import { buildSwitch, handleVideoSettingsChange } from './snippetHelpers.js';

/**
 *
 * @param {function} openModal
 * @param {string} mediaUrl
 * @param {string} contentObjectId
 * @param {string} mediaName
 * @param {function} saveSnippet
 * @param {string} containerCacheKey
 * @param {HTMLElement} sidebarSnippetRef
 * @returns {Promise<void>}
 */
export default async function openPreviewModal(
  openModal,
  mediaUrl,
  contentObjectId,
  mediaName,
  saveSnippet,
  containerCacheKey,
  sidebarSnippetRef,
) {
  const { customerSubDomain, snippets } = getCachedElement('settings');

  const modalContainerCacheKey = `${pluginInfo.id}-${contentObjectId}-cloudflare-stream-plugin-preview-modal`;
  let cloudflareStreamPluginPreviewModal = getCachedElement(
    modalContainerCacheKey,
  )?.element;

  if (!cloudflareStreamPluginPreviewModal) {
    cloudflareStreamPluginPreviewModal = document.createElement('div');
    cloudflareStreamPluginPreviewModal.classList.add(
      'flotiq-ui-plugin-cloudflare-stream-preview-modal-container',
    );

    cloudflareStreamPluginPreviewModal.innerHTML = modal;

    const { snippet, uId, config } = snippets[mediaName];

    const previewContainer = cloudflareStreamPluginPreviewModal.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-snippet-in-modal-preview',
    );

    const snippetContainer = cloudflareStreamPluginPreviewModal.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-in-modal-snippet',
    );

    const settingsContainer = cloudflareStreamPluginPreviewModal.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-snippet-settings-container',
    );

    const loaderContainer = cloudflareStreamPluginPreviewModal.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-modal-loader-container',
    );

    const saveSettingsButton = cloudflareStreamPluginPreviewModal.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-save-settings-button',
    );

    previewContainer.innerHTML = snippet;
    snippetContainer.textContent = snippet;

    //@todo add translations
    settingsContainer.innerHTML = Object.keys(config)
      .map((settingsElement) =>
        buildSwitch(settingsElement, config[settingsElement]),
      )
      .join('');

    handleVideoSettingsChange(
      settingsContainer,
      previewContainer,
      snippetContainer,
      loaderContainer,
      saveSettingsButton,
      sidebarSnippetRef,
      config,
      customerSubDomain,
      uId,
      mediaName,
      saveSnippet,
      modalContainerCacheKey,
      containerCacheKey,
    );
  }

  await openModal({
    title: 'Video settings',
    size: '3xl',
    content: cloudflareStreamPluginPreviewModal,
  });
}
