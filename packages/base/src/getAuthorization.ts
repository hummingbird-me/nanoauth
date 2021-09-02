import { ERROR_MAPPING, PopupFailed } from './errors';
import {
  applyMiddleware,
  MiddlewareInstance,
  OAuth2Response,
} from './middleware';

type Config = {
  url: string;
  middlewares: MiddlewareInstance[];
};

export default function getAuthorization({
  url,
  middlewares,
}: Config): Promise<OAuth2Response> {
  return applyMiddleware(middlewares, (url) => {
    return new Promise((resolve, reject) => {
      const authWindow = window.open(
        url,
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
            reject(
              new ERROR_MAPPING[response.error](response.error_description)
            );
          } else {
            resolve(response);
          }
          authWindow.close();
          window.removeEventListener('message', listener);
        }
      };
      window.addEventListener('message', listener);
    });
  })(url);
}
