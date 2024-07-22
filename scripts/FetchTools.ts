/**
 * @param url - the URL to request 
 * @param decoder - the decoder function from a generated protobuf definition 
 * @returns The decoded request result
 * 
 * For example, requesting http://0.1.2.3:8080/test that returns a proto message with typescript 
 * definition of Post:
 * 
 * ```vue
 * <!-- Note that in <script setup> tag, awaiting promises (the await keyword) is allowed -->
 * <script lang="ts" setup>
 * import { Post } from '~/types/proto/Post';
 * 
 * const url = 'http://0.1.2.3:8080/test';
 * const result = await fetchAndDecode(url, Post.decode); // returns a Post object
 * console.log(result);
 * </script>
 * ```
 */
export const fetchAndDecode = async <T>(url: string, decoder: (byte: Uint8Array) => T): Promise<T> => {
  const fetchRes = await (await fetch(url)).text();
  const bytes = Uint8Array.from(atob(fetchRes), c => c.charCodeAt(0));
  return decoder(bytes);
};