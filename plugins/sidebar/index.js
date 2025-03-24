import { schema as pluginInfo } from '../manage/settings-schema.js';
import {
  addElementToCache,
  deleteCachedElement,
  getCachedElement,
} from '../../common/plugin-element-cache.js';
import { getMediaName, getMediaUrl } from '../../common/helpers.js';
import template from 'inline:../templates/template.html';
import checkIfVideoExist from './lib/checkIfVideoExists.js';
import handleSaveVideo from './lib/handleSaveVideo.js';
import openPreviewModal from './lib/openPreviewModal.js';
import i18n from 'i18next';

/**
 * Create sidebar plugin window
 * @param {object} contentObject
 * @param {string} apiUrl
 * @param {string} spaceId
 * @param {object} toast
 * @param {function} openModal
 * @param saveSnippet
 * @returns {*}
 */
export const createSidebar = (
  contentObject,
  apiUrl,
  spaceId,
  toast,
  openModal,
  saveSnippet,
) => {
  const containerCacheKey = `${pluginInfo.id}-${contentObject.id || 'new'}-cloudflare-stream-plugin-container`;
  let cloudflareStreamPluginContainer =
    getCachedElement(containerCacheKey)?.element;

  if (!cloudflareStreamPluginContainer) {
    cloudflareStreamPluginContainer = document.createElement('div');
    cloudflareStreamPluginContainer.classList.add(
      'flotiq-ui-plugin-cloudflare-stream-container',
    );

    const mediaUrl = getMediaUrl(apiUrl, contentObject);
    const mediaName = getMediaName(spaceId, contentObject);

    cloudflareStreamPluginContainer.innerHTML = template;

    const saveVideoBtn = cloudflareStreamPluginContainer.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-button',
    );

    const previewModeBtn = cloudflareStreamPluginContainer.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-preview-button',
    );

    const loader = cloudflareStreamPluginContainer.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-button-loader',
    );

    const codeSnippet = cloudflareStreamPluginContainer.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-snippet',
    );

    const copyToClipboardBtn = cloudflareStreamPluginContainer.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-snippet-header-copy',
    );

    const pluginHeader = cloudflareStreamPluginContainer.querySelector(
      '.flotiq-ui-plugin-cloudflare-stream-header',
    );

    const snippetHeader = cloudflareStreamPluginContainer.querySelector(
      '.flotiq-ui-plugin-cloudflare-stream-snippet-header-content',
    );

    saveVideoBtn.textContent = i18n.t('generateStreamIframe');
    previewModeBtn.textContent = i18n.t('previewTool');
    pluginHeader.textContent = i18n.t('title');
    snippetHeader.textContent = i18n.t('snippet');

    checkIfVideoExist(
      saveVideoBtn,
      loader,
      previewModeBtn,
      codeSnippet,
      mediaName,
      saveSnippet,
      toast,
    );

    saveVideoBtn.addEventListener('click', () => {
      handleSaveVideo(
        saveVideoBtn,
        previewModeBtn,
        loader,
        codeSnippet,
        mediaUrl,
        mediaName,
        saveSnippet,
        toast,
      );
    });

    const saveSnippetCallback = async (mediaName, uId, snippet, newConfig) => {
      await saveSnippet(mediaName, uId, snippet, newConfig);
      deleteCachedElement(containerCacheKey);
    };

    previewModeBtn.addEventListener('click', () => {
      openPreviewModal(
        openModal,
        contentObject.id,
        mediaName,
        saveSnippetCallback,
        toast,
        codeSnippet,
      );
    });

    copyToClipboardBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeSnippet.innerText).then(() => {
        toast.success(i18n.t('copySuccess'), { duration: 5000 });
      });
    });

    addElementToCache(cloudflareStreamPluginContainer, containerCacheKey);
  }

  return cloudflareStreamPluginContainer;
};
