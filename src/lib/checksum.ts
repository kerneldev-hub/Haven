/**
 * Computes the SHA-256 hash of a file or Blob using the native WebCrypto API.
 * This runs entirely in the browser sandbox without external network dependencies.
 */
export async function calculateSHA256(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
