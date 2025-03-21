import { schema as pluginInfo } from '../../manage/settings-schema.js';
import { getCachedElement } from '../../../common/plugin-element-cache.js';
import modal from 'inline:../../templates/modal.html';
import { buildSwitch, handleVideoSettingsChange } from './snippetHelpers.js';
import i18n from '../../../i18n';

//@todo move modal title, btn title, and btn callback to props
/**
 *
 * @param {function} openModal
 * @param {string} mediaUrl
 * @param {string} contentObjectId
 * @param {string} mediaName
 * @param {function} saveSnippet
 * @param {string} containerCacheKey
 * @param {HTMLElement} sidebarSnippetRef
 * @param {object} toast
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
  toast,
) {
  const { customerSubDomain, snippets } = getCachedElement('settings');

  //@todo add modal title to cache key
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

    const copyToClipboardBtn = cloudflareStreamPluginPreviewModal.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-snippet-modal-header-copy',
    );

    const snippetHeader = cloudflareStreamPluginPreviewModal.querySelector(
      '.flotiq-ui-plugin-cloudflare-stream-snippet-header-content',
    );

    copyToClipboardBtn.textContent = i18n.t('modal.saveSettings');
    snippetHeader.textContent = i18n.t('snippet');

    previewContainer.innerHTML = snippet;
    snippetContainer.textContent = snippet;

    settingsContainer.innerHTML = Object.keys(config)
      .map((settingsElement) =>
        buildSwitch(
          settingsElement,
          i18n.t(`modal.settings.${settingsElement}`),
          config[settingsElement],
        ),
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

    copyToClipboardBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(snippetContainer.innerText).then(() => {
        toast.success(i18n.t('copySuccess'), { duration: 5000 });
      });
    });
  }

  await openModal({
    title: i18n.t('modal.title'),
    size: '3xl',
    content: cloudflareStreamPluginPreviewModal,
  });
}
