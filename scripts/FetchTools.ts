import type { Writer } from "protobufjs";

/**
 * Make a GET request to a HTTP server
 * 
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
export const getAndDecode = async <T>(url: string, decoder: (byte: Uint8Array) => T): Promise<T> => {
  const fetchRes = await (await fetch(url)).blob();
  const bytes = new Uint8Array(await fetchRes.arrayBuffer());
  return decoder(bytes);
};

/**
 * Make a POST request to a HTTP server
 * 
 * @param url - the URL to request
 * @param encoder - the encoder function from a generated protobuf definition
 * @param data - the payload
 * @param decoder - the decoder function from a generated protobuf definition 
 * @returns The decoded request result
 */
export const postAndDecode = async <T, R>(
  url: string, encoder: ((_t: T, _o?: Writer) => Writer), data: T, decoder: (byte: Uint8Array) => R): Promise<R> => {

  const fetchRes = await (await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-protobuf",
    },
    body: encoder(data).finish()
  })).blob();

  const bytes = new Uint8Array(await fetchRes.arrayBuffer());
  return decoder(bytes);
}