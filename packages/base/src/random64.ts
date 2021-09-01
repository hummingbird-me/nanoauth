const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function encode(bytes: Uint8Array): string {
  let base64 = '';

  for (let i = 0; i < bytes.length; i += 3) {
    base64 += ALPHABET[bytes[i] >> 2];
    base64 += ALPHABET[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    base64 += ALPHABET[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    base64 += ALPHABET[bytes[i + 2] & 63];
  }

  if (bytes.length % 3 === 2) {
    base64 = base64.substring(0, base64.length - 1);
  } else if (bytes.length % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2);
  }

  return base64;
}

export default function random64(bytes: number): string {
  const random = new Uint8Array(bytes);
  window.crypto.getRandomValues(random);

  return encode(random);
}
