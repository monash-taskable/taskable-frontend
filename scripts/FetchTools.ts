import type { Writer } from "protobufjs";
import urlJoin from "url-join";
import type { Optional } from "~/types/Optional";

export class FetchError extends Error {
  code: number;
  status: string;

  constructor(code: number, status: string){
    super(String(code) + ": " + status);
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, FetchError.prototype);
  }
}

/**
 * Make a GET request to a HTTP server
 * 
 * @param url - the URL to request 
 * @param decoder - the decoder function from a generated protobuf definition 
 * @returns The decoded request in a FetchResult object
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
export const getAndDecode = async <T>(url: string, decoder: (byte: Uint8Array) => T): Promise<FetchResult<T>> => {
  try{
    const fetchRes = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
  
    if (fetchRes.ok){
      const blob = await fetchRes.blob();
      const bytes = new Uint8Array(await blob.arrayBuffer());
      return new FetchResult(decoder(bytes));
    }
  
    return new FetchResult(decoder(new Uint8Array()), new FetchError(fetchRes.status, fetchRes.statusText));
  }
  catch (e) {
    return new FetchResult(decoder(new Uint8Array()), undefined, (e instanceof Error) ? e : new Error());
  }
};

/**
 * Make a POST request to a HTTP server
 * 
 * @param url - the URL to request
 * @param encoder - the encoder function from a generated protobuf definition
 * @param data - the payload
 * @param decoder - the decoder function from a generated protobuf definition 
 * @returns The decoded request in a FetchResult object
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
  url: string, encoder: ((_t: T, _o?: Writer) => Writer), data: T, decoder: (byte: Uint8Array) => R): Promise<FetchResult<R>> => {
  
  try {
    const fetchRes = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-protobuf",
      },
      body: encoder(data).finish()
    })
  
    if (fetchRes.ok){
      const blob = await fetchRes.blob();
      const bytes = new Uint8Array(await blob.arrayBuffer());
      return new FetchResult(decoder(bytes));
    }
  
    return new FetchResult(decoder(new Uint8Array()), new FetchError(fetchRes.status, fetchRes.statusText));
  }
  catch (e) {
    return new FetchResult(decoder(new Uint8Array()), undefined, (e instanceof Error) ? e : new Error());
  }
}

/**
 * Get the full url for an api endpoint
 * 
 * @param endpoint The API endpoint (excluding /api/ root path)
 * @returns an url prefixed with API Hostname/api/
 */
export const api = (endpoint: string): string => {
  const config = useRuntimeConfig();
  return urlJoin(config.public.apiHost, 'api', endpoint);
};

export class FetchResult<T> {
  _result: T;
  _httpError: Optional<FetchError>;
  _otherError: Optional<Error>;

  constructor (result: T, httpError?: Optional<FetchError>, otherError?: Optional<Error>){
    this._result = result;
    this._httpError = httpError;
    this._otherError = otherError;
  }

  res(callback: (result: T) => void): this{
    if (this._httpError === undefined && this._otherError === undefined) {
      callback(this._result);
    }

    return this;
  }

  httpErr(callback: (httpError: FetchError) => void): this {
    if (this._httpError !== undefined) {
      callback(this._httpError);
    }

    return this;
  }

  otherErr(callback: (error: Error) => void): this {
    if (this._otherError !== undefined){
      callback(this._otherError);
    }

    return this;
  }
}