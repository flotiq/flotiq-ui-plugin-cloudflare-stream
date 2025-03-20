import { getSnippet } from './snippetHelpers.js';
import { getVideo } from './cloudflareApi.js';
import { getCachedElement } from '../../../common/plugin-element-cache.js';

/**
 *
 * @param {HTMLButtonElement} buttonElement
 * @param {HTMLDivElement} loaderElement
 * @param {HTMLElement}codeSnippetElement
 * @param {string} mediaName
 * @param {object} toast
 * @param {function} saveSnippet
 */
export default function checkIfVideoExist(
  buttonElement,
  loaderElement,
  codeSnippetElement,
  mediaName,
  toast,
  saveSnippet,
) {
  const { apiKey, accountId, customerSubDomain, snippets } =
    getCachedElement('settings');

  if (!snippets?.[mediaName]) {
    //@todo add error handling
    getVideo(mediaName, apiKey, accountId)
      .then((response) => response.json())
      .then(async ({ result }) => {
        if (result.length === 0) return;

        const media = result[0];

        const snippet = getSnippet(customerSubDomain, media.uid);

        await saveSnippet(mediaName, media.uid, snippet);
        codeSnippetElement.textContent = snippet;

        loaderElement.classList.remove(
          'flotiq-ui-plugin-cloudflare-stream-loader-container--load',
        );
        buttonElement.classList.add(
          'flotiq-ui-plugin-cloudflare-stream-button--hidden',
        );
      });
    return;
  }

  loaderElement.classList.remove(
    'flotiq-ui-plugin-cloudflare-stream-loader-container--load',
  );
  buttonElement.classList.add(
    'flotiq-ui-plugin-cloudflare-stream-button--hidden',
  );
  codeSnippetElement.textContent = snippets[mediaName].snippet;
}
