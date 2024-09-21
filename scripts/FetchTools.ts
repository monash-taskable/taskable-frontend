import type { Writer } from "protobufjs";
import urlJoin from "url-join";
import type { Optional } from "~/types/Optional";
import { LoginExchangeRequest } from "~/types/proto/Auth";

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
    const req = await this.commit();
    if (req._response === undefined){
      return new FetchResult(req._response, <Optional<R>>req._result, req._httpError, req._otherError);
    }

    const blob = await req._response.blob()
    const bytes = new Uint8Array(await blob.arrayBuffer());
    return new FetchResult(req._response ,<Optional<R>> decoder(bytes));
  }

  async commit(): Promise<FetchResult<undefined>> {
    try {
      if (FetchRequest._csrf !== undefined && this._csrfOverride === undefined) {
        this.attachHeader({ "X-XSRF-TOKEN": FetchRequest._csrf });
      }

      const rawResult = await fetch(this._dest, this._reqInit);

      console.log("fetch: " + this._dest);

      // if error, try verify (when protectedDefaultBehaviour)
      if (
        this._protectedDefaultBehaviour &&
        !rawResult.ok &&
        rawResult.status === 403 &&
        !await useAppStateStore().validateSession()
      ){
        const dialogs = useDialogs();
        dialogs.closeAllDialogs();
        dialogs.openDialog({
          dialogType: "sessionError",
          payload: undefined,
          width: "300px",
          title: "signin.sessionError",
          titleI18n: true,
          style: {
            titleBackground: "var(--dangerous-weak)",
            titleColor: "var(--dangerous-strong)",
          },
          icon: "fluent:error-circle-20-regular",
        }, false)
      }
      
      if (!rawResult.ok) {
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
    getTempCsrf: () => FetchRequest.api("/auth/get-temp-csrf"),
    loginExchange: (authCode: string, csrf: string) => FetchRequest.api("/auth/login-exchange").post().payload(LoginExchangeRequest.encode, {authorizationCode: authCode}).overrideCsrf(csrf),
    logout: () => FetchRequest.api("/auth/logout").delete(),
    verify: () => FetchRequest.api("/auth/verify"),
    getCSRF: () => FetchRequest.api("/auth/get-csrf"),
    getProfile: () => FetchRequest.protectedAPI("/users/get-profile"),
    updateProfile: () => FetchRequest.protectedAPI("/users/update-profile"),
  },
} as const;