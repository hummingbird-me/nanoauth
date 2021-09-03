import { PopupFailed, InvalidRequest } from './errors';
import getAuthorization from './getAuthorization';

describe('getAuthorization', () => {
  test('opens a window with the URL', async () => {
    const url = 'https://example.com';
    window.open = jest.fn().mockReturnValue({});
    getAuthorization({ url });
    expect(window.open).toBeCalledWith(
      url,
      '',
      'toolbar=no location=no status=no'
    );
  });

  test('rejects when the popup does not open', async () => {
    const url = 'https://example.com';
    window.open = jest.fn().mockReturnValue(null);
    await expect(getAuthorization({ url })).rejects.toThrow(PopupFailed);
  });

  test('ignores messages from unknown origin', async () => {
    const url = 'https://example.com';

    Object.defineProperty(global, 'location', {
      value: { origin: url },
    });
    window.open = jest.fn().mockReturnValue({ close: jest.fn() });
    let listener: (event: Partial<MessageEvent>) => void = () => null;
    window.addEventListener = jest.fn().mockImplementation((e, l) => {
      if (e == 'message') listener = l;
    });

    const result = getAuthorization({ url });

    listener({
      origin: 'https://kitsu.io',
      data: {
        type: 'nanoauth.return',
        params: { foo: 'EVIL' },
      },
    });

    listener({
      origin: url,
      data: {
        type: 'nanoauth.return',
        params: { foo: 'bar' },
      },
    });

    await expect(result).resolves.toEqual({ foo: 'bar' });
  });

  test('ignores messages of unknown type', async () => {
    const url = 'https://example.com';

    Object.defineProperty(global, 'location', {
      value: { origin: url },
    });
    window.open = jest.fn().mockReturnValue({ close: jest.fn() });
    let listener: (event: Partial<MessageEvent>) => void = () => null;
    window.addEventListener = jest.fn().mockImplementation((e, l) => {
      if (e == 'message') listener = l;
    });

    const result = getAuthorization({ url });

    listener({
      origin: url,
      data: {
        type: 'other.event',
      },
    });

    listener({
      origin: url,
      data: {
        type: 'nanoauth.return',
        params: { foo: 'bar' },
      },
    });

    await expect(result).resolves.toEqual({ foo: 'bar' });
  });

  test('ignores messages without type in payload', async () => {
    const url = 'https://example.com';

    Object.defineProperty(global, 'location', {
      value: { origin: url },
    });
    window.open = jest.fn().mockReturnValue({ close: jest.fn() });
    let listener: (event: Partial<MessageEvent>) => void = () => null;
    window.addEventListener = jest.fn().mockImplementation((e, l) => {
      if (e == 'message') listener = l;
    });

    const result = getAuthorization({ url });

    listener({
      origin: url,
      data: {},
    });

    listener({
      origin: url,
      data: {
        type: 'nanoauth.return',
        params: { foo: 'bar' },
      },
    });

    await expect(result).resolves.toEqual({ foo: 'bar' });
  });

  test('closes the popup and removes the message listener on return', async () => {
    const url = 'https://example.com';

    Object.defineProperty(global, 'location', {
      value: { origin: url },
    });
    const closeFn = jest.fn();
    window.open = jest.fn().mockReturnValue({ close: closeFn });
    let listener: (event: Partial<MessageEvent>) => void = () => null;
    window.addEventListener = jest.fn().mockImplementation((e, l) => {
      if (e == 'message') listener = l;
    });
    window.removeEventListener = jest.fn();

    const result = getAuthorization({ url });

    listener({
      origin: url,
      data: {
        type: 'nanoauth.return',
        params: { foo: 'bar' },
      },
    });

    await result;

    expect(closeFn).toHaveBeenCalled();
    expect(removeEventListener).toHaveBeenCalledWith('message', listener);
  });

  test('rejects with an error when given one', async () => {
    const url = 'https://example.com';

    Object.defineProperty(global, 'location', {
      value: { origin: url },
    });
    window.open = jest.fn().mockReturnValue({ close: jest.fn() });
    let listener: (event: Partial<MessageEvent>) => void = () => null;
    window.addEventListener = jest.fn().mockImplementation((e, l) => {
      if (e == 'message') listener = l;
    });
    window.removeEventListener = jest.fn();

    const result = getAuthorization({ url });

    listener({
      origin: url,
      data: {
        type: 'nanoauth.return',
        params: { error: 'invalid_request' },
      },
    });

    await expect(result).rejects.toThrow(InvalidRequest);
  });

  test('resolves with whatever params are passed from the popup', async () => {
    const url = 'https://example.com';

    Object.defineProperty(global, 'location', {
      value: { origin: url },
    });
    window.open = jest.fn().mockReturnValue({ close: jest.fn() });
    let listener: (event: Partial<MessageEvent>) => void = () => null;
    window.addEventListener = jest.fn().mockImplementation((e, l) => {
      if (e == 'message') listener = l;
    });
    window.removeEventListener = jest.fn();

    const result = getAuthorization({ url });

    listener({
      origin: url,
      data: {
        type: 'nanoauth.return',
        params: { code: '__test__' },
      },
    });

    await expect(result).resolves.toEqual({ code: '__test__' });
  });
});
