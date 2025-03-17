import { schema as pluginInfo } from '../manage/settings-schema.js';
import {
  addElementToCache,
  getCachedElement,
} from '../../common/plugin-element-cache.js';
import { getSnippet, getVideo, saveVideo } from './lib/index.js';
import { getMediaName, getMediaUrl } from '../../common/helpers.js';
import template from 'inline:../templates/template.html';

function checkIfVideoExist(
  buttonElement,
  loaderElement,
  codeSnippetElement,
  mediaName,
  apiKey,
  accountId,
  customerSubDomain,
) {
  //@todo add error handling
  getVideo(mediaName, apiKey, accountId)
    .then((response) => response.json())
    .then(({ result }) => {
      loaderElement.classList.remove(
        'flotiq-ui-plugin-cloudflare-stream-loader-container--load',
      );

      if (result.length === 0) return;

      const media = result[0];
      codeSnippetElement.textContent = getSnippet(customerSubDomain, media.uid);
      buttonElement.classList.add(
        'flotiq-ui-plugin-cloudflare-stream-button--hidden',
      );
    });
}

function handleSaveVideo(
  buttonElement,
  loaderElement,
  codeSnippetElement,
  mediaUrl,
  mediaName,
  apiKey,
  accountId,
  customerSubDomain,
  toast,
) {
  loaderElement.classList.add(
    'flotiq-ui-plugin-cloudflare-stream-loader-container--load',
  );
  //@todo add error handling
  saveVideo(mediaUrl, mediaName, apiKey, accountId)
    .then((response) => response.json())
    .then(({ result }) => {
      loaderElement.classList.remove(
        'flotiq-ui-plugin-cloudflare-stream-loader-container--load',
      );

      codeSnippetElement.textContent = getSnippet(
        customerSubDomain,
        result.uid,
      );

      buttonElement.classList.add(
        'flotiq-ui-plugin-cloudflare-stream-button--hidden',
      );
      toast.success('Video saved successfully!');
    });
}

export const createSidebar = (
  contentObject,
  apiUrl,
  { apiKey, accountId, customerSubDomain },
  spaceId,
  toast,
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

    const btn = cloudflareStreamPluginContainer.querySelector(
      '#flotiq-ui-plugin-cloudflare-stream-button',
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
      btn,
      loader,
      codeSnippet,
      mediaName,
      apiKey,
      accountId,
      customerSubDomain,
    );

    btn.addEventListener('click', () => {
      handleSaveVideo(
        btn,
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

    copyToClipboardBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeSnippet.innerText).then(() => {
        toast.success('Code copied to clipboard!');
      });
    });

    addElementToCache(cloudflareStreamPluginContainer, containerCacheKey);
  }

  return cloudflareStreamPluginContainer;
};
