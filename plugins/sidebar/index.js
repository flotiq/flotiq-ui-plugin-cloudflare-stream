import { schema as pluginInfo } from '../manage/settings-schema.js';
import {
  addElementToCache,
  getCachedElement,
} from '../../common/plugin-element-cache.js';
import { getMediaName, getMediaUrl } from '../../common/helpers.js';
import template from 'inline:../templates/template.html';
import checkIfVideoExist from './lib/checkIfVideoExists.js';
import handleSaveVideo from './lib/handleSaveVideo.js';
import openPreviewModal from './lib/openPreviewModal.js';

export const createSidebar = (
  contentObject,
  apiUrl,
  { apiKey, accountId, customerSubDomain, snippets },
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

    checkIfVideoExist(
      saveVideoBtn,
      loader,
      codeSnippet,
      mediaName,
      apiKey,
      accountId,
      customerSubDomain,
      toast,
      snippets,
      saveSnippet,
    );

    saveVideoBtn.addEventListener('click', () => {
      handleSaveVideo(
        saveVideoBtn,
        loader,
        codeSnippet,
        mediaUrl,
        mediaName,
        apiKey,
        accountId,
        customerSubDomain,
        toast,
      );
    });

    previewModeBtn.addEventListener('click', () => {
      openPreviewModal(
        openModal,
        mediaName,
        contentObject.id,
        customerSubDomain,
        snippets,
        mediaName,
      );
    });

    copyToClipboardBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeSnippet.innerText).then(() => {
        toast.success('Code copied to clipboard!');
      });
    });

    addElementToCache(cloudflareStreamPluginContainer, containerCacheKey);
  }

  return cloudflareStreamPluginContainer;
};
