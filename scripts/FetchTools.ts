export const fetchAndDecode = async <T>(url: string, decoder: (byte: Uint8Array) => T): Promise<T> => {
  const fetchRes = await (await fetch(url)).text();
  const bytes = Uint8Array.from(atob(fetchRes), c => c.charCodeAt(0));;
  return decoder(bytes);
};