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
 * Get the full url for an api endpoint
 * 
 * @param endpoint The API endpoint (excluding /api/ root path)
 * @returns an url prefixed with API Hostname/api/
 */
const api = (endpoint: string): string => {
  const config = useRuntimeConfig();
  return urlJoin(config.public.apiHost, 'api', endpoint);
};

export class FetchRequest {
  _dest: string;
  _reqInit: RequestInit;
  _csrfOverride: Optional<string>;
  _protectedDefaultBehaviour: Boolean;
  static _csrf: Optional<string>
  
  constructor(destination: string) {
    this._dest = destination;
    this._reqInit = { credentials: "include" };
    this._csrfOverride;
    this._protectedDefaultBehaviour = false;
  }

  static api(destination: string) {
    return new FetchRequest(api(destination));
  }

  static protectedAPI(destination: string) {
    const req = new FetchRequest(api(destination));
    req._protectedDefaultBehaviour = true;
    return req;
  }

  static updateCsrf(csrf: string) {
    FetchRequest._csrf = csrf;
  }

  overrideCsrf(csrf: string): this {
    this._csrfOverride = csrf;
    this.attachHeader({ "X-XSRF-TOKEN": csrf })
    return this;
  }

  method(method: string): this {
    this._reqInit.method = method;
    return this;
  }

  get = () => this.method("GET");
  post = () => this.method("POST");
  delete = () => this.method("DELETE");

  payload<T>(encoder: ((_t: T, _o?: Writer) => Writer), data: T): this {
    this.attachHeader({
      "Content-Type": "application/x-protobuf"
    });
    this._reqInit.body = encoder(data).finish();
    return this;
  }

  attachHeader(headers: HeadersInit): this {
    this._reqInit.headers = {...this._reqInit.headers, ...headers};
    return this;
  }
  
  async commitAndRecv<R>(decoder: (_b: Uint8Array) => R): Promise<FetchResult<R>> {
    try {
      if (FetchRequest._csrf !== undefined && this._csrfOverride === undefined) {
        this.attachHeader({ "X-XSRF-TOKEN": FetchRequest._csrf });
      }

      const rawResult = await fetch(this._dest, this._reqInit);

      if (!rawResult.ok){
        return new FetchResult(rawResult ,<Optional<R>> undefined, new FetchError(rawResult.status, rawResult.statusText));
      }

      const blob = await rawResult.blob();
      const bytes = new Uint8Array(await blob.arrayBuffer());
      return new FetchResult(rawResult ,<Optional<R>> decoder(bytes));

    }
    catch (e) {
      return new FetchResult(undefined ,<Optional<R>>undefined, undefined, e instanceof Error ? e : new Error("Unknown Error"));
    }
  }

  async commit(): Promise<FetchResult<undefined>> {
    try {
      if (FetchRequest._csrf !== undefined && this._csrfOverride === undefined) {
        this.attachHeader({ "X-XSRF-TOKEN": FetchRequest._csrf });
      }

      const rawResult = await fetch(this._dest, this._reqInit);

      if (!rawResult.ok){
        return new FetchResult(rawResult ,undefined, new FetchError(rawResult.status, rawResult.statusText));
      }

      return new FetchResult(rawResult ,undefined);

    }
    catch (e) {
      return new FetchResult(undefined ,undefined, undefined, e instanceof Error ? e : new Error("Unknown Error"));
    }
  }
}

export class FetchResult<T> {
  /**
   * The decoded protobuf result if applicable
   */
  _result: Optional<T>;


  _httpError: Optional<FetchError>;
  _otherError: Optional<Error>;

  /**
   * The actual response object returned by fetchAPI
   */
  _response: Optional<Response>;

  constructor (response?: Optional<Response>, result?: Optional<T>, httpError?: Optional<FetchError>, otherError?: Optional<Error>){
    this._response = response;
    this._result = result;
    this._httpError = httpError;
    this._otherError = otherError;
  }

  res(callback: (result: T) => void): this {
    if (!this.isError() && this._result !== undefined) {
      callback(this._result);
    }

    return this;
  }

  resIgnoreUndefined(callback: (result: Optional<T>) => void): this {
    if (!this.isError()) {
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

  isError(): boolean {
    return this._httpError !== undefined || this._otherError !== undefined;
  }
}

export const API = {
  auth: {
    getTempCsrf: "/auth/get-temp-csrf",
    loginExchange: "/auth/login-exchange",
  }
} as const;