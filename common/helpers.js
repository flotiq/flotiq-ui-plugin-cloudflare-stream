export const parsePluginSettings = (settings) => {
  const parsedSettings = JSON.parse(settings || '{}');

  if (Object.keys(parsedSettings).length === 0) {
    return null;
  }

  return {
    apiKey: parsedSettings?.api_key || '',
    accountId: parsedSettings?.account_id || '',
    customerSubDomain: parsedSettings?.customer_sub_domain || '',
  };
};

export function getMediaUrl(getApiUrl, contentObject) {
  return `${getApiUrl}${contentObject.url}`;
}

export function getMediaName(spaceId, contentObject) {
  return `${spaceId}-${contentObject.id}`;
}
