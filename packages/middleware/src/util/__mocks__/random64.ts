export default function random64(bytes: number): string {
  const length = Math.floor(bytes * 1.33);

  return Array(length).fill('A').join('');
}
