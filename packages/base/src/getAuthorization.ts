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
        if (event.data?.type !== 'nanoauth.return') return;

        const { params } = event.data;
        if (params.error) {
          reject(new ERROR_MAPPING[params.error](params.error_description));
        } else {
          resolve(params);
        }
        authWindow.close();
        window.removeEventListener('message', listener);
      };
      window.addEventListener('message', listener);
    });
  })(url);
}
