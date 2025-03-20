import pluginInfo from '../../plugin-manifest.json';

//@todo add translations
//@todo add helptexts
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
        label: 'Api token',
        unique: false,
        helpText: '',
        inputType: 'text',
      },
      account_id: {
        label: 'Account ID',
        unique: false,
        helpText: '',
        inputType: 'text',
      },
      customer_sub_domain: {
        label: 'Customer subdomain',
        unique: false,
        helpText: '',
        inputType: 'text',
      },
    },
  },
};
