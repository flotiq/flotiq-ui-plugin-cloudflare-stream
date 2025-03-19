import { schema as pluginInfo } from '../plugins/manage/settings-schema.js';

export const parsePluginSettings = (settings) => {
  const parsedSettings = JSON.parse(settings || '{}');

  if (Object.keys(parsedSettings).length === 0) {
    return null;
  }

  return {
    apiKey: parsedSettings?.api_key || '',
    accountId: parsedSettings?.account_id || '',
    customerSubDomain: parsedSettings?.customer_sub_domain || '',
    snippets: parsedSettings?.snippets || {},
  };
};

export function getMediaUrl(getApiUrl, contentObject) {
  return `${getApiUrl}${contentObject.url}`;
}

export function getMediaName(spaceId, contentObject) {
  return `${spaceId}-${contentObject.id}`;
}

/**
 *
 * @param client
 * @param settings
 * @param toast
 * @returns {Promise<void>}
 */
export function buildSaveSnippetToConfig(client, settings, toast) {
  return async (mediaName, snippet) => {
    const { body, ok } = await client['_plugin_settings'].patch(pluginInfo.id, {
      settings: JSON.stringify({
        ...settings,
        snippets: {
          [mediaName]: snippet,
        },
      }),
    });

    if (!ok) {
      console.error(pluginInfo.id, 'updating plugin settings', body);
      //@todo add translations
      toast.error('SettingsUpdateError', { duration: 5000 });
    }
  };
}
