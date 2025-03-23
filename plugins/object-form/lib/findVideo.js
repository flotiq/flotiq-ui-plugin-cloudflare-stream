import { getVideo, saveVideo } from '../../../common/cloudflareApi.js';

/**
 * Check if video exist in Cloudflare, if not add video
 * @param {string} mediaName
 * @param {string} apiKey
 * @param {string} accountId
 * @param {string} videoUrl
 * @returns {Promise<Object>}
 */
export default async function findVideo(
  mediaName,
  apiKey,
  accountId,
  videoUrl,
) {
  const cfVideo = await getVideo(mediaName, apiKey, accountId);
  const response = await cfVideo.json();

  if (response.result.length !== 0) {
    return response.result[0];
  }

  const savedVideo = await saveVideo(videoUrl, mediaName, apiKey, accountId);

  return (await savedVideo.json()).result;
}
