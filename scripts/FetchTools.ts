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
 * const result = await getAndDecode(url, Post.decode); // returns a Post object
 * console.log(result);
 * </script>
 * ```
 */
export const getAndDecode = async <T>(url: string, decoder: (byte: Uint8Array) => T): Promise<T> => {
  const fetchRes = await (await fetch(url, {
    method: "GET",
    credentials: "include",
  })).blob();
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
 * 
 * For example, requesting http://0.1.2.3:8080/test with a request message with typescript definition
 * of ReqPost that returns a proto message with typescript definition of ResPost:
 * 
 * ```vue
 * <!-- Note that in <script setup> tag, awaiting promises (the await keyword) is allowed -->
 * <script lang="ts" setup>
 * import { ReqPost, ResPost } from '~/types/proto/Post';
 * 
 * const url = 'http://0.1.2.3:8080/test';
 * const postData = {foo: "bar"}; // a ReqPost object
 * const result = await postAndDecode(url, ReqPost.encode, postData, ResPost.decode); // returns a Post object
 * console.log(result);
 * </script>
 * ```
 */
export const postAndDecode = async <T, R>(
  url: string, encoder: ((_t: T, _o?: Writer) => Writer), data: T, decoder: (byte: Uint8Array) => R): Promise<R> => {

  const fetchRes = await (await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-protobuf",
    },
    body: encoder(data).finish()
  })).blob();

  const bytes = new Uint8Array(await fetchRes.arrayBuffer());
  return decoder(bytes);
}