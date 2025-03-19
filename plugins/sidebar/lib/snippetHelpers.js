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
 *
 * @param label
 * @param name
 * @returns {string}
 */
export function buildSwitch(label) {
  return `
    <div class="flotiq-ui-plugin-cloudflare-stream-toggle-switch-container">
        <label class="flotiq-ui-plugin-cloudflare-stream-toggle-switch">
            <input 
                class="flotiq-ui-plugin-cloudflare-stream-toggle-switch-input"
                 type="checkbox"
                 name="${label}"
            />
            <span class="flotiq-ui-plugin-cloudflare-stream-slider"></span>
        </label>
        <span>${label}</span>
    </div>`;
}

export function handleVideoSettingsChange(container) {
  container
    .querySelectorAll('.flotiq-ui-plugin-cloudflare-stream-toggle-switch-input')
    .forEach((input) => {
      input.addEventListener('change', (event) => {
        console.log(event.target.name, event.target.checked);
      });
    });
}
