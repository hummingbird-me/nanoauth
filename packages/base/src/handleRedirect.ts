/**
 * This script exposes a function to be called on the redirect target, and pretty much just sends
 * the token back to the parent window and closes itself. As such, it is very compact and can be
 * directly embedded into the HTML.
 */

export default function handleRedirect(): void {
  const hash = location.hash.slice(1);
  const search = location.search.slice(1);
  const params = new URLSearchParams(`${search}&${hash}`);

  window.opener?.postMessage(
    {
      type: 'nanoauth.return',
      params: Object.fromEntries(params),
    },
    location.origin
  );
}
