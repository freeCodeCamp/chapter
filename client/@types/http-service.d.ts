export type Obj = Record<string, string>;
export type HTTP_METHOD = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export type HttpServiceResponse<V> = Promise<{ res: Response; resData: V }>;

export interface IHttpServiceInterface<V> {
  get: (url: string, params: Obj, headers: Obj) => HttpServiceResponse<V>;
  post: (
    url: string,
    params: Obj,
    body: any,
    headers: Obj,
  ) => HttpServiceResponse<V>;
  patch: (
    url: string,
    params: Obj,
    body: any,
    headers: Obj,
  ) => HttpServiceResponse<V>;
  delete: (url: string, params: Obj, headers: Obj) => HttpServiceResponse<V>;
}
