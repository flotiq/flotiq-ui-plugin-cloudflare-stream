import { getSnippet } from './snippetHelpers.js';
import { addObjectToCache } from '../../../common/plugin-element-cache.js';
import { getVideo } from './cloudflareApi.js';
import { saveSnippetToConfig } from '../../../common/helpers.js';

/**
 *
 * @param {HTMLButtonElement} buttonElement
 * @param {HTMLDivElement} loaderElement
 * @param {HTMLElement}codeSnippetElement
 * @param {string} mediaName
 * @param {string} apiKey
 * @param {string} accountId
 * @param {string} customerSubDomain
 * @param {object} toast
 * @param {object} snippets
 * @param {function} saveSnippet
 */
export default function checkIfVideoExist(
  buttonElement,
  loaderElement,
  codeSnippetElement,
  mediaName,
  apiKey,
  accountId,
  customerSubDomain,
  toast,
  snippets,
  saveSnippet,
) {
  console.log(snippets);
  if (!snippets?.[mediaName]) {
    //@todo add error handling
    getVideo(mediaName, apiKey, accountId)
      .then((response) => response.json())
      .then(async ({ result }) => {
        if (result.length === 0) return;

        const media = result[0];
        const snippet = getSnippet(customerSubDomain, media.uid);

        await saveSnippet(mediaName, snippet);
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
  codeSnippetElement.textContent = snippets[mediaName];
}
