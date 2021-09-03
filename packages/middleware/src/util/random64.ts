import encodeBase64 from './encodeBytes64';

export default function random64(bytes: number): string {
  const random = new Uint8Array(bytes);
  window.crypto.getRandomValues(random);

  return encodeBase64(random);
}
