import { schema as pluginInfo } from '../../manage/settings-schema.js';
import { getCachedElement } from '../../../common/plugin-element-cache.js';
import modal from 'inline:../../templates/modal.html';
import { buildSwitch, handleVideoSettingsChange } from './snippetHelpers.js';
import i18n from '../../../i18n';

/**
 * Open preview snippet modal
 * @param {function} openModal
 * @param {string} contentObjectId
 * @param {string} mediaName
 * @param {function} saveSettingsButtonCallback
 * @param {object} toast
 * @param {HTMLElement|null} sidebarSnippetRef
 * @param {string} modalTitleTranslationKey
 * @param {string} modalButtonTranslationKey
 * @param {function|null} closeModal
 * @returns {Promise<void>}
 */
export default async function openPreviewModal(
  openModal,
  contentObjectId,
  mediaName,
  saveSettingsButtonCallback,
  toast,
  sidebarSnippetRef = null,
  modalTitleTranslationKey = 'modal.title',
  modalButtonTranslationKey = 'modal.saveSettings',
  closeModal = null,
) {
  const { customerSubDomain, snippets } = getCachedElement('settings');

  const modalContainerCacheKey = `${pluginInfo.id}-${contentObjectId}-${modalTitleTranslationKey}-cloudflare-stream-plugin-preview-modal`;
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

    saveSettingsButton.textContent = i18n.t(modalButtonTranslationKey);
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
      saveSettingsButtonCallback,
      sidebarSnippetRef,
      config,
      customerSubDomain,
      uId,
      mediaName,
      modalContainerCacheKey,
      closeModal,
    );

    copyToClipboardBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(snippetContainer.innerText).then(() => {
        toast.success(i18n.t('copySuccess'), { duration: 5000 });
      });
    });
  }

  await openModal({
    id: modalContainerCacheKey,
    title: i18n.t(modalTitleTranslationKey),
    size: '3xl',
    content: cloudflareStreamPluginPreviewModal,
  });
}
