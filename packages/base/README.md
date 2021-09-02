# `@nanoauth/base` — The Core of NanoAuth

Provides a set of basic utilities for managing OAuth2 flows in a popup.

You can absolutely use this directly, but if there's a `@nanoauth/` package specific to the site
you want to access, I recommend using that instead. The stuff in this package is pretty low-level.

## Usage

Install NanoAuth as a dependency

```
npm install @nanoauth/base
```

Set up your redirect target. This should be an HTML file which just calls `handleRedirect()`, and it
**must** be served from the same origin as your application.

## `async getAuthorization(url: URL | string): Promise<Record<string, unknown>>`

Opens a popup for an OAuth2 flow and resolves with the resulting data. If the OAuth2 Provider
redirects with an error or the popup fails to open, this will reject.

## `handleRedirect(): void`

_Only used for the redirect target._ Extracts the URL params for both Authorization Code (`?query`)
and Implicit Grant (`#fragment`) redirect responses, and sends them to the originating page with
`postMessage`.

## `generateRandom64(bytes: number): string`

Utility for PKCE support. Uses browser crypto to securely generate a base64-encoded string of random
bytes.

## `Errors`

### `PopupFailed extends Error`

Failed to open a popup. This usually happens due to a popup blocker. Check that you are calling
`getAuthorization` within one second of user interaction (ie, clicking a button)

### `StateMismatch extends Error`

The state parameter received back from the OAuth2 provider wasn't the expected one.

### `OAuth2Error extends Error`

Base class for generic OAuth2 errors.

### `InvalidRequest extends OAuth2Error`

The request is missing a required parameter, includes an invalid parameter value, includes a
parameter more than once, or is otherwise malformed.

### `UnauthorizedClient extends OAuth2Error`

The client is not authorized to request an authorization code using this method.

### `AccessDenied extends OAuth2Error`

The resource owner or authorization server denied the request.

### `UnsupportedResponseType extends OAuth2Error`

The authorization server does not support obtaining an authorization code using this method.

### `InvalidScope extends OAuth2Error`

The requested scope is invalid, unknown, or malformed.

### `ServerError extends OAuth2Error`

The authorization server encountered an unexpected condition that prevented it from fulfilling the
request.

### `TemporarilyUnavailable extends OAuth2Error`

The authorization server is currently unable to handle the request due to a temporary overloading or
maintenance of the server.
