import pluginInfo from '../../plugin-manifest.json';
import i18n from '../../i18n.js';

export const schema = {
  id: pluginInfo.id,
  name: pluginInfo.id,
  label: pluginInfo?.name,
  internal: false,
  schemaDefinition: {
    type: 'object',
    allOf: [
      {
        $ref: '#/components/schemas/AbstractContentTypeSchemaDefinition',
      },
      {
        type: 'object',
        properties: {
          api_key: {
            type: 'string',
            minLength: 1,
          },
          account_id: {
            type: 'string',
            minLength: 1,
          },
          customer_sub_domain: {
            type: 'string',
            minLength: 1,
          },
        },
      },
    ],
    required: ['api_key', 'account_id', 'customer_sub_domain'],
    additionalProperties: true,
  },
  metaDefinition: {
    order: ['api_key', 'account_id', 'customer_sub_domain'],
    propertiesConfig: {
      api_key: {
        label: i18n.t('settings.apiToken'),
        unique: false,
        helpText: i18n.t('settings.apiTokenHelpText'),
        inputType: 'text',
      },
      account_id: {
        label: i18n.t('settings.accountId'),
        unique: false,
        helpText: i18n.t('settings.accountIdHelpText'),
        inputType: 'text',
      },
      customer_sub_domain: {
        label: i18n.t('settings.customerSubDomain'),
        unique: false,
        helpText: i18n.t('settings.customerSubDomainHelpText'),
        inputType: 'text',
      },
    },
  },
};
