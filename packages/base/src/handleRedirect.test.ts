import handleRedirect from './handleRedirect';

describe('handleRedirect', () => {
  test('extracts the search and hash parameters and posts them back to the opener', () => {
    const postMessage = jest.fn();
    window.opener = ({ postMessage } as unknown) as Window;
    Object.defineProperty(global, 'location', {
      value: {
        origin: 'https://example.org',
        hash: '#foo=bar',
        search: '?boo=far',
      },
    });

    handleRedirect();
    expect(postMessage).toHaveBeenCalledWith(
      {
        type: 'nanoauth.return',
        params: { foo: 'bar', boo: 'far' },
      },
      'https://example.org'
    );
  });

  test('does nothing if the opener is missing', () => {
    window.opener = null;
    Object.defineProperty(global, 'location', {
      value: {
        origin: 'https://example.org',
        hash: '#foo=bar',
        search: '?boo=far',
      },
    });

    handleRedirect();
  });
});
