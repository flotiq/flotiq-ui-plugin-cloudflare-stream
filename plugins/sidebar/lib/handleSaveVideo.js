import { getSnippet } from './snippetHelpers.js';
import {
  addObjectToCache,
  getCachedElement,
} from '../../../common/plugin-element-cache.js';
import { saveVideo } from './cloudflareApi.js';

/**
 * Handles saving video to cloudflare streaming
 * @param {HTMLButtonElement} buttonElement
 * @param {HTMLDivElement} loaderElement
 * @param {HTMLElement} codeSnippetElement
 * @param {string} mediaUrl
 * @param {string} mediaName
 * @param  toast
 */
export default function handleSaveVideo(
  buttonElement,
  loaderElement,
  codeSnippetElement,
  mediaUrl,
  mediaName,
  toast,
) {
  const { apiKey, accountId, customerSubDomain } = getCachedElement('settings');

  loaderElement.classList.add(
    'flotiq-ui-plugin-cloudflare-stream-loader-container--load',
  );

  //@todo add error handling
  //@todo add saving snippet into config
  saveVideo(mediaUrl, mediaName, apiKey, accountId)
    .then((response) => response.json())
    .then(({ result }) => {
      loaderElement.classList.remove(
        'flotiq-ui-plugin-cloudflare-stream-loader-container--load',
      );

      addObjectToCache(`${mediaName}-media-uid`, result.uid);
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
