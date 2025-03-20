import { schema as pluginInfo } from '../plugins/manage/settings-schema.js';
import { addObjectToCache, getCachedElement } from './plugin-element-cache.js';

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
  };
}

export function parsePluginSettings(settings) {
  const parsedSettings = JSON.parse(settings || '{}');

  if (Object.keys(parsedSettings).length === 0) {
    return null;
  }

  return encodePluginSettings(parsedSettings);
}

export function getMediaUrl(getApiUrl, contentObject) {
  return `${getApiUrl}${contentObject.url}`;
}

export function getMediaName(spaceId, contentObject) {
  return `${spaceId}-${contentObject.id}`;
}

export const DEFAULT_OPTIONS = {
  controls: true,
  muted: false,
  preload: false,
  loop: false,
  autoplay: false,
  lazy: false,
};

/**
 *
 * @param client
 * @param toast
 * @returns {Promise<void>}
 */
export function buildSaveSnippetToConfig(client, toast) {
  return async (mediaName, uId, snippet, config = DEFAULT_OPTIONS) => {
    const settings = getCachedElement('settings');
    const decodedSettings = decodePluginSettings(settings);

    const newSettings = {
      ...decodedSettings,
      snippets: {
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

    if (!ok) {
      console.error(pluginInfo.id, 'updating plugin settings', body);
      //@todo add translations
      toast.error('SettingsUpdateError', { duration: 5000 });
      return;
    }
    addObjectToCache('settings', encodePluginSettings(newSettings));
  };
}
