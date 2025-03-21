import { getSnippet } from './snippetHelpers.js';
import {
  addObjectToCache,
  getCachedElement,
} from '../../../common/plugin-element-cache.js';
import { saveVideo } from '../../../common/cloudflareApi.js';
import i18n from '../../../i18n.js';

/**
 * Handles saving video to cloudflare streaming
 * @param {HTMLButtonElement} buttonElement
 * @param {HTMLDivElement} loaderElement
 * @param {HTMLElement} codeSnippetElement
 * @param {string} mediaUrl
 * @param {string} mediaName
 * @param {function} saveSnippet
 * @param {object} toast
 */
export default function handleSaveVideo(
  buttonElement,
  loaderElement,
  codeSnippetElement,
  mediaUrl,
  mediaName,
  saveSnippet,
  toast,
) {
  const { apiKey, accountId, customerSubDomain } = getCachedElement('settings');

  loaderElement.classList.add(
    'flotiq-ui-plugin-cloudflare-stream-loader-container--load',
  );

  saveVideo(mediaUrl, mediaName, apiKey, accountId)
    .then((response) => response.json())
    .then(async ({ result }) => {
      addObjectToCache(`${mediaName}-media-uid`, result.uid);
      codeSnippetElement.textContent = getSnippet(
        customerSubDomain,
        result.uid,
      );

      const snippet = getSnippet(customerSubDomain, result.uid);
      await saveSnippet(mediaName, result.uid, snippet);

      loaderElement.classList.remove(
        'flotiq-ui-plugin-cloudflare-stream-loader-container--load',
      );
      buttonElement.classList.add(
        'flotiq-ui-plugin-cloudflare-stream-button--hidden',
      );
      toast.success(i18n.t('videoSavedInCloudflare'), { duration: 5000 });
    })
    .catch((e) => {
      console.error(e);
      toast.error(i18n.t('errorMessage'), { duration: 5000 });
    });
}
