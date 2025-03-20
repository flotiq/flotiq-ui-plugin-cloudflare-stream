import i18n from 'i18next';

i18n.init({
  fallbackLng: 'en',
  supportedLngs: ['en', 'pl'],
  resources: {
    en: {
      translation: {
        title: 'Cloudflare Video streaming',
        generateStreamIframe: 'Generate stream iframe',
        previewTool: 'Preview tool',
        snippet: 'Code snippet:',
        copySuccess: 'Code copied to clipboard!',
        videoSavedInCloudflare: 'Video saved in cloudflare',
        errorMessage: 'Something went wrong in Cloudflare Video plugin',
        settingsUpdateError: 'Something went wrong while updating settings',
        modal: {
          title: 'Video settings',
          saveSettings: 'Save settings',
          settings: {
            controls: 'Controls',
            muted: 'Muted',
            preload: 'Preload',
            loop: 'Loop',
            autoplay: 'Auto play',
            lazy: 'Lazy loading',
          },
        },
      },
    },
    pl: {
      translation: {
        title: 'Cloudflare Video streaming',
        generateStreamIframe: 'Generuj iframe strumienia',
        previewTool: 'Narzędzie podglądu',
        snippet: 'Fragment kodu:',
        copySuccess: 'Kod skopiowany do schowka!',
        videoSavedInCloudflare: 'Wideo zapisane w Cloudflare',
        errorMessage: 'Coś poszło nie tak we wtyczce Cloudflare Video',
        settingsUpdateError: 'Coś poszło nie tak podczas aktualizacji ustawień',
        modal: {
          title: 'Ustawienia wideo',
          saveSettings: 'Zapisz ustawienia',
          settings: {
            controls: 'Sterowanie',
            muted: 'Wyciszenie',
            preload: 'Wstępne ładowanie',
            loop: 'Zapętlenie',
            autoplay: 'Automatyczne odtwarzanie',
            lazy: 'Leniwe ładowanie',
          },
        },
      },
    },
  },
});

export default i18n;
