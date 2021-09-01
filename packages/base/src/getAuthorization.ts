import { ERROR_MAPPING, PopupFailed } from './errors';

export default function getAuthorization(
  url: URL | string
): Promise<Record<string, string>> {
  const stringUrl = url instanceof URL ? url.toString() : url;

  return new Promise((resolve, reject) => {
    const authWindow = window.open(
      stringUrl,
      '',
      'toolbar=no location=no status=no'
    );
    if (!authWindow) {
      return reject(new PopupFailed('Failed to open auth window'));
    }

    const listener = (
      event: MessageEvent<{
        type: 'nanoauth.return';
        params: [string, string][];
      }>
    ) => {
      if (event.origin !== window.location.origin) return;
      if (!event.data.type) return;
      if (!event.data.type.startsWith('nanoauth.')) return;

      const { type, params } = event.data;
      if (type === 'nanoauth.return') {
        const response = Object.fromEntries(params);
        if (response.error) {
          reject(new ERROR_MAPPING[response.error](response.error_description));
        } else {
          resolve(response);
        }
        authWindow.close();
        window.removeEventListener('message', listener);
      }
    };
    window.addEventListener('message', listener);
  });
}
