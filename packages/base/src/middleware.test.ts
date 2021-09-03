import { applyMiddleware } from './middleware';

describe('middleware', () => {
  test('can modify the URL before it is sent', async () => {
    const result = await applyMiddleware(
      [
        async (url, next) => next(`__${url}__`),
        async (url, next) => next(url.toUpperCase()),
      ],
      async (url) => ({ url })
    )('test');

    expect(result).toEqual({ url: '__TEST__' });
  });

  test('can modify the result object', async () => {
    const result = await applyMiddleware(
      [async (url, next) => ({ ...next(url), foo: 'bar' })],
      async () => ({})
    )('test');

    expect(result).toEqual({ foo: 'bar' });
  });
});
