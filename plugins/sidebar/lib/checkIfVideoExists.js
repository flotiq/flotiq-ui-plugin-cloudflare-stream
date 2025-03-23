import { getSnippet } from './snippetHelpers.js';
import { getVideo } from '../../../common/cloudflareApi.js';
import { getCachedElement } from '../../../common/plugin-element-cache.js';
import i18n from '../../../i18n';

/**
 * check if video exists in settings if not fetch from CF and save in settings
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
  saveSnippet,
  toast,
) {
  const { apiKey, accountId, customerSubDomain, snippets } =
    getCachedElement('settings');

  if (!snippets?.[mediaName]) {
    getVideo(mediaName, apiKey, accountId)
      .then((response) => response.json())
      .then(async ({ result }) => {
        if (result.length === 0) {
          loaderElement.classList.remove(
            'flotiq-ui-plugin-cloudflare-stream-loader-container--load',
          );
          return;
        }

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
      })
      .catch((e) => {
        console.error(e);
        toast.error(i18n.t('errorMessage'), { duration: 5000 });
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
