/**
 * This Class is a very minimal wrapper around fetch
 * to make API calls easy.
 */

import fetch from 'cross-fetch';

type Obj = Record<string, string>;
type HTTP_METHOD = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export class HttpService<V = any> {
  public static baseUrl = '/api/v1'; // TODO: need to create some ENV for this
  public static baseHeaders = {
    'Content-Type': 'application/json',
  };

  // make it nicer on the backend for development purposes
  private stringify(data: any): string {
    if (process.env.NODE_ENV === 'development') {
      return JSON.stringify(data, null, 2);
    }
    return JSON.stringify(data);
  }

  private urlHelper(url: string, params: Obj): string {
    if (!url.startsWith('/')) {
      url = `/${url}`;
    }
    return HttpService.baseUrl + url + this.stringifyParams(params);
  }

  private stringifyParams(params: Obj): string {
    return Object.keys(params).reduce((acc, key, i) => {
      return Object.prototype.hasOwnProperty.call(params, key)
        ? `${acc}${i !== 0 ? '&' : '?'}${key}=${params[key]}`
        : acc;
    }, '');
  }

  private request(
    url: string,
    params: Obj,
    data: any,
    headers: Obj,
    method: HTTP_METHOD,
  ) {
    return fetch(this.urlHelper(url, params), {
      headers: { ...HttpService.baseHeaders, ...headers },
      body: this.stringify(data),
      method,
    });
  }

  public async get(url: string, params: Obj, headers: Obj) {
    const res = await this.request(url, params, undefined, headers, 'GET');
    const resData = await res.json();

    return [res, resData];
  }

  public async post(url: string, params: Obj, data: any, headers: Obj) {
    const res = await this.request(url, params, data, headers, 'POST');
    const resData = await res.json();

    return [res, resData];
  }

  public async patch(url: string, params: Obj, data: any, headers: Obj) {
    const res = await this.request(url, params, data, headers, 'PATCH');
    const resData = await res.json();

    return [res, resData];
  }

  public async delete(url: string, params: Obj, headers: Obj) {
    const res = await this.request(url, params, undefined, headers, 'DELETE');
    const resData = await res.json();

    return [res, resData];
  }
}
