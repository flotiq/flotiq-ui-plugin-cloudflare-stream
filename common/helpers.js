import { schema as pluginInfo } from '../plugins/manage/settings-schema.js';
import { addObjectToCache, getCachedElement } from './plugin-element-cache.js';
import i18n from '../i18n.js';

export function encodePluginSettings(settings) {
  return {
    apiKey: settings?.api_key || '',
    accountId: settings?.account_id || '',
    customerSubDomain: settings?.customer_sub_domain || '',
    snippets: settings?.snippets || {},
  };
}

export function decodePluginSettings(settings) {
  return {
    api_key: settings.apiKey,
    account_id: settings.accountId,
    customer_sub_domain: settings.customerSubDomain,
    snippets: settings.snippets,
  };
}

export function parsePluginSettings(settings) {
  const parsedSettings = JSON.parse(settings || '{}');

  if (Object.keys(parsedSettings).length === 0) {
    return null;
  }

  return encodePluginSettings(parsedSettings);
}

export function getMediaUrl(apiUrl, contentObject) {
  return `${apiUrl}${contentObject.url}`;
}

export function getMediaName(spaceId, contentObject) {
  return `${spaceId}-${contentObject.id}`;
}

export async function fetchMediaObject(dataUrl, client) {
  if (!dataUrl) return;
  const imageId = dataUrl.split('/api/v1/content/_media/')?.pop();
  return imageId ? (await client['_media'].get(imageId)).body : '';
}

export const DEFAULT_OPTIONS = {
  controls: true,
  muted: false,
  preload: false,
  loop: false,
  autoplay: false,
  lazy: false,
};

export const videoMimeTypes = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/x-matroska',
  'video/x-msvideo',
  'video/quicktime',
  'video/mpeg',
  'video/x-flv',
  'video/3gpp',
  'video/3gpp2',
  'video/x-ms-wmv',
];

/**
 * build save snippet function
 * @param client
 * @param toast
 * @param setPluginSettings
 * @returns {Promise<void>}
 */
export function buildSaveSnippetToConfig(client, toast, setPluginSettings) {
  return async (mediaName, uId, snippet, config = DEFAULT_OPTIONS) => {
    const settings = getCachedElement('settings');
    const decodedSettings = decodePluginSettings(settings);

    const newSettings = {
      ...decodedSettings,
      snippets: {
        ...decodedSettings.snippets,
        [mediaName]: {
          snippet,
          config,
          uId,
        },
      },
    };

    const { body, ok } = await client['_plugin_settings'].patch(pluginInfo.id, {
      settings: JSON.stringify(newSettings),
    });

    setPluginSettings(JSON.stringify(newSettings));

    if (!ok) {
      console.error(pluginInfo.id, 'updating plugin settings', body);
      toast.error(i18n.t('settingsUpdateError'), { duration: 5000 });
      return;
    }
    addObjectToCache('settings', encodePluginSettings(newSettings));
  };
}
