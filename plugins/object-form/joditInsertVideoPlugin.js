import { playIcon } from './icons.js';
import openPreviewModal from '../sidebar/lib/openPreviewModal.js';
import { openVideoModal } from './lib/openVideoModal.js';
import i18n from '../../i18n.js';

/**
 * Init video picking modal, open preview modal and insert snippet into editor
 * @param {object} Jodit
 * @param {function} openSchemaModal
 * @param {function} openModal
 * @param {function} closeModal
 * @param {object} client
 * @param {string} spaceId
 * @param {string} apiUrl
 * @param saveSnippet
 * @param {object} toast
 */
export function initVideoModalPlugin(
  Jodit,
  openSchemaModal,
  openModal,
  closeModal,
  client,
  spaceId,
  apiUrl,
  saveSnippet,
  toast,
) {
  Jodit.defaultOptions.controls['custom-video'] = {
    icon: playIcon,
    tooltip: i18n.t('joditToolTip'),
    exec: async (editor) => {
      const result = await openVideoModal(
        openSchemaModal,
        client,
        spaceId,
        apiUrl,
        saveSnippet,
      );

      if (!result) {
        return;
      }

      const { mediaName, contentObject, message, ok } = result;

      if (!ok) {
        toast.error(i18n.t(message ? message : 'errorMessage'), {
          duration: 5000,
        });
        return;
      }

      let snippetContent = '';

      const saveBtnCallback = async (_mediaName, _uId, snippet) => {
        snippetContent = snippet;
      };

      await openPreviewModal(
        openModal,
        contentObject.id,
        mediaName,
        saveBtnCallback,
        toast,
        null,
        'videoModal.title',
        'videoModal.button',
        closeModal,
      );

      const iframeContainer = document.createElement('div');
      iframeContainer.innerHTML = snippetContent;

      editor.selection.insertHTML(iframeContainer);
      editor.synchronizeValues();
    },
  };
}
