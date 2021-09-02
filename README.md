# nanoauth

**🚨 THIS IS PRE-RELEASE SOFTWARE, DO NOT USE IN PRODUCTION YET 🚨**

**Like Omniauth for your SPA.**

A collection of lightweight OAuth2 utilities and clients, designed to handle the redirect flow and
other client-side nonsense for you, within the context of a single-page application.

## Usage

1. Install with `npm install @nanoauth/base`
2. Set up a redirect page, to catch the responses from the server and pass them back to your SPA.
   This should be an HTML file with the following script, served from the same origin as your SPA:

   ```typescript
   import { handleRedirect } from '@nanoauth/base';

   handleRedirect();
   ```

3. Set up one of the site-specific clients, or use the generic
   [`getAuthorization`](packages/base/README.md) function. Boom, you get the result of the redirect.

## General Utilities

### [`@nanoauth/base`](packages/base)

Provides a basic, low-level set of utilities for building OAuth2 integrations, as well as the
redirect handler for all the site-specific clients.

## Site-Specific Clients

### [`@nanoauth/myanimelist`](packages/myanimelist)

An OAuth2 client for MyAnimeList. Handles PKCE for you, you just have to exchange the returned
code+nonce for the actual token on your server.
