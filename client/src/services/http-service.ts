/**
 * This Class is a very minimal wrapper around fetch
 * to make API calls easy.
 */

import fetch from 'cross-fetch';
import {
  IHttpServiceInterface,
  Obj,
  HTTP_METHOD,
  HttpServiceResponse,
} from '../@types/http-service';

export class HttpService<V = any> implements IHttpServiceInterface<V> {
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
    body: any,
    headers: Obj,
    method: HTTP_METHOD,
  ) {
    return fetch(this.urlHelper(url, params), {
      headers: { ...HttpService.baseHeaders, ...headers },
      body: this.stringify(body),
      method,
    });
  }

  public async get(
    url: string,
    params: Obj,
    headers: Obj,
  ): HttpServiceResponse<V> {
    const res = await this.request(url, params, undefined, headers, 'GET');
    const resData = (await res.json()) as V;

    return { res, resData };
  }

  public async post(
    url: string,
    params: Obj,
    body: any,
    headers: Obj,
  ): HttpServiceResponse<V> {
    const res = await this.request(url, params, body, headers, 'POST');
    const resData = (await res.json()) as V;

    return { res, resData };
  }

  public async patch(
    url: string,
    params: Obj,
    body: any,
    headers: Obj,
  ): HttpServiceResponse<V> {
    const res = await this.request(url, params, body, headers, 'PATCH');
    const resData = (await res.json()) as V;

    return { res, resData };
  }

  public async delete(
    url: string,
    params: Obj,
    headers: Obj,
  ): HttpServiceResponse<V> {
    const res = await this.request(url, params, undefined, headers, 'DELETE');
    const resData = (await res.json()) as V;

    return { res, resData };
  }
}
