import { playIcon } from './icons.js';
import openPreviewModal from '../sidebar/lib/openPreviewModal.js';
import { openVideoModal } from './lib/openVideoModal.js';
import i18n from '../../i18n.js';

//@todo add translations
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
    tooltip: 'Osadź obrazek z wideo',
    exec: async (editor) => {
      const { mediaName, contentObject, ok } = await openVideoModal(
        openSchemaModal,
        client,
        spaceId,
        apiUrl,
        saveSnippet,
      );

      //@todo add validation if video media was selected

      if (!ok) {
        toast.error(i18n.t('errorMessage'), { duration: 5000 });
        return;
      }

      let snippetContent = '';

      const saveBtnCallback = async (mediaName, uId, snippet, _) => {
        snippetContent = snippet;
      };

      //@todo add translations
      await openPreviewModal(
        openModal,
        contentObject.id,
        mediaName,
        saveBtnCallback,
        toast,
        null,
        '',
        '',
        closeModal,
      );

      const iframeContainer = document.createElement('div');
      iframeContainer.innerHTML = snippetContent;

      editor.selection.insertHTML(iframeContainer);
      editor.synchronizeValues();
    },
  };
}
