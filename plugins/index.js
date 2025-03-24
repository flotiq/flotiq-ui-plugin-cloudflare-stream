import { addObjectToCache, registerFn } from '../common/plugin-element-cache';
import pluginInfo from '../plugin-manifest.json';
import cssString from 'inline:./styles/style.css';
import { handleManagePlugin } from './manage/index.js';
import { createSidebar } from './sidebar/index.js';
import {
  buildSaveSnippetToConfig,
  parsePluginSettings,
  videoMimeTypes,
} from '../common/helpers.js';
import { initVideoModalPlugin } from './object-form/joditInsertVideoPlugin.js';
import i18n from 'i18next';

registerFn(
  pluginInfo,
  (
    handler,
    client,
    {
      toast,
      getPluginSettings,
      setPluginSettings,
      getSpaceId,
      getApiUrl,
      openModal,
      closeModal,
      openSchemaModal,
      getLanguage,
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
    const language = getLanguage();

    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }

    const saveSnippet = buildSaveSnippetToConfig(
      client,
      toast,
      setPluginSettings,
    );

    // Initialize Jodit plugin
    initVideoModalPlugin(
      Jodit,
      openSchemaModal,
      openModal,
      closeModal,
      client,
      spaceId,
      getApiUrl(),
      saveSnippet,
      toast,
    );

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
          contentType?.name !== '_media' ||
          !videoMimeTypes.includes(contentObject.mimeType)
        ) {
          return;
        }

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
      if (properties?.inputType === 'richtext') {
        config.editorConfig = {
          ...config.editorConfig,
          extraButtons: ['|', 'custom-video'],
        };
      }
    });

    handler.on('flotiq.language::changed', ({ language }) => {
      if (language !== i18n.language) {
        i18n.changeLanguage(language);
      }
    });
  },
);
