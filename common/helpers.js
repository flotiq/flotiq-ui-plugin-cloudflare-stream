export const parsePluginSettings = (settings) => {
  const parsedSettings = JSON.parse(settings || '{}');

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
