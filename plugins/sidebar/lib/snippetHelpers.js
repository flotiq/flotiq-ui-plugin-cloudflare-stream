import { deleteCachedElement } from '../../../common/plugin-element-cache.js';

/**
 * Build iframe with selected video to render in player
 * @param {string} customerSubDomian
 * @param {string} uuId
 * @param controls
 * @param {boolean} muted
 * @param {boolean} preload
 * @param {boolean} loop
 * @param {boolean} autoPlay
 * @param {boolean} lazyLoading
 * @returns {string}
 */
export function getSnippet(
  customerSubDomian,
  uuId,
  controls = true,
  muted = false,
  preload = false,
  loop = false,
  autoPlay = false,
  lazyLoading = false,
) {
  const url = new URL(`https://${customerSubDomian}/${uuId}/iframe`);

  if (!controls) {
    url.searchParams.append('controls', 'false');
  }
  if (muted) {
    url.searchParams.append('muted', 'true');
  }
  if (preload) {
    url.searchParams.append('preload', 'true');
  }
  if (autoPlay) {
    url.searchParams.append('autoplay', 'true');
  }
  if (loop) {
    url.searchParams.append('loop', 'true');
  }

  const loading = !lazyLoading ? '' : `\n loading="lazy"`;

  return `
<iframe
 src="${url.toString()}"
 allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
 allowfullscreen="true"
 id="stream-player" ${loading} 
</iframe>`;
}

/**
 * Build switch input
 * @param {string} name
 * @param {string} label
 * @param {boolean} selected
 * @returns {string}
 */
export function buildSwitch(name, label, selected) {
  return `
    <div class="flotiq-ui-plugin-cloudflare-stream-toggle-switch-container">
        <label class="flotiq-ui-plugin-cloudflare-stream-toggle-switch">
            <input
                class="flotiq-ui-plugin-cloudflare-stream-toggle-switch-input"
                 type="checkbox"
                 name="${name}"
                 ${selected && 'checked'}
            />
            <span class="flotiq-ui-plugin-cloudflare-stream-slider"></span>
        </label>
        <span>${label}</span>
    </div>`;
}

/**
 * Handle saving snippet settings into plugin config
 * @param {HTMLDivElement} container
 * @param {HTMLDivElement} previewRef
 * @param {HTMLPreElement} snippetRef
 * @param {HTMLDivElement} loaderRef
 * @param {HTMLButtonElement} saveSettingsButtonRef
 * @param {function} saveSettingsButtonCallback
 * @param {HTMLElement|null} sidebarSnippetRef
 * @param {object} config
 * @param {string} customerSubDomain
 * @param {string} uId
 * @param {string} mediaName
 * @param {string} modalContainerCacheKey
 * @param {function|null} closeModal
 */
export function handleVideoSettingsChange(
  container,
  previewRef,
  snippetRef,
  loaderRef,
  saveSettingsButtonRef,
  saveSettingsButtonCallback,
  sidebarSnippetRef,
  config,
  customerSubDomain,
  uId,
  mediaName,
  modalContainerCacheKey,
  closeModal,
) {
  const newConfig = { ...config };

  container
    .querySelectorAll('.flotiq-ui-plugin-cloudflare-stream-toggle-switch-input')
    .forEach((input) => {
      input.addEventListener('change', (event) => {
        newConfig[event.target.name] = event.target.checked;

        const snippetConfig = {
          customerSubDomain,
          uId,
          ...newConfig,
        };

        const snippet = getSnippet(...Object.values(snippetConfig));
        previewRef.innerHTML = snippet;
        snippetRef.textContent = snippet;
      });
    });

  saveSettingsButtonRef.addEventListener('click', async () => {
    loaderRef.classList.add(
      'flotiq-ui-plugin-cloudflare-stream-modal-loader-container--load',
    );
    const snippet = snippetRef.textContent;
    if (sidebarSnippetRef !== null) {
      sidebarSnippetRef.textContent = snippet;
    }

    try {
      await saveSettingsButtonCallback(mediaName, uId, snippet, newConfig);
      deleteCachedElement(modalContainerCacheKey);
      if (closeModal) {
        closeModal(modalContainerCacheKey, {
          mediaName,
          uId,
          snippet,
          newConfig,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      loaderRef.classList.remove(
        'flotiq-ui-plugin-cloudflare-stream-modal-loader-container--load',
      );
    }
  });
}
