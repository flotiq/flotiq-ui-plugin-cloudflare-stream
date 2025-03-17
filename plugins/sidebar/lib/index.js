/**
 * Save video in CF
 * @param videoUrl
 * @param videoName
 * @param apiToken
 * @param accountId
 * @returns {Promise<Response>}
 */
export async function saveVideo(videoUrl, videoName, apiToken, accountId) {
  return fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/copy`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: videoUrl,
        meta: { name: videoName },
      }),
    },
  );
}

/**
 * Check if video exists in CF
 * @param videoName
 * @param apiToken
 * @param accountId
 * @returns {Promise<Response>}
 */
export async function getVideo(videoName, apiToken, accountId) {
  return fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream?search={${videoName}}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
}

/**
 * Build iframe with selected video to render in player
 * @param customerSubDomian
 * @param uuId
 * @returns {string}
 */
export function getSnippet(customerSubDomian, uuId) {
  return `
<iframe
 src="https://${customerSubDomian}/${uuId}/iframe"
 allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
 allowfullscreen="true"
 id="stream-player"
</iframe>`.replace(/\t/g, '');
}
