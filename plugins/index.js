import { addObjectToCache, registerFn } from '../common/plugin-element-cache';
import pluginInfo from '../plugin-manifest.json';
import cssString from 'inline:./styles/style.css';
import { handleManagePlugin } from './manage/index.js';
import { createSidebar } from './sidebar/index.js';
import {
  buildSaveSnippetToConfig,
  parsePluginSettings,
} from '../common/helpers.js';
import {
  imgCustomVideoPopup,
  initVideoModalPlugin,
} from './object-form/joditInsertVideoPlugin.js';

const videoMimeTypes = [
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

export default videoMimeTypes;

registerFn(
  pluginInfo,
  (
    handler,
    client,
    {
      toast,
      getPluginSettings,
      getSpaceId,
      getApiUrl,
      openModal,
      openSchemaModal,
      Jodit,
    },
  ) => {
    /**
     * Add plugin styles to the head of the document
     */
    if (!document.getElementById(`${pluginInfo.id}-styles`)) {
      const style = document.createElement('style');
      style.id = `${pluginInfo.id}-styles`;
      style.textContent = cssString;
      document.head.appendChild(style);
    }

    const spaceId = getSpaceId();

    handler.on('flotiq.plugins.manage::form-schema', () =>
      handleManagePlugin(),
    );

    handler.on(
      'flotiq.form.sidebar-panel::add',
      ({ contentType, contentObject }) => {
        const settings = parsePluginSettings(getPluginSettings());
        addObjectToCache('settings', settings);

        if (
          !settings ||
          !contentObject ||
          contentType.name !== '_media' ||
          !videoMimeTypes.includes(contentObject.mimeType)
        ) {
          return;
        }

        const saveSnippet = buildSaveSnippetToConfig(client, toast);

        return createSidebar(
          contentObject,
          getApiUrl(),
          spaceId,
          toast,
          openModal,
          saveSnippet,
        );
      },
    );

    handler.on('flotiq.form.field::config', ({ properties, config }) => {
      const saveSnippet = buildSaveSnippetToConfig(client, toast);

      initVideoModalPlugin(
        Jodit,
        openSchemaModal,
        client,
        spaceId,
        getApiUrl(),
        saveSnippet,
      );
      if (properties?.inputType === 'richtext') {
        config.editorConfig = {
          ...config.editorConfig,
          extraButtons: ['|', 'custom-video'],
          popup: {
            ...Jodit.defaultOptions.popup,
            img: [...Jodit.defaultOptions.popup['img'], imgCustomVideoPopup],
          },
        };
      }
    });
  },
);
