import { expect } from "chai";
import type { APIRequestContext, APIResponse } from "playwright";
import type { RuntimeConfig } from "../../config/runtimeConfig.ts";

export class ApiActions {
  private request: APIRequestContext;
  private runtime: RuntimeConfig;

  constructor(request: APIRequestContext, runtime: RuntimeConfig) {
    this.request = request;
    this.runtime = runtime;
  }

  async get(url: string, options?: { params?: Record<string, string | number | boolean>; headers?: Record<string, string> }): Promise<APIResponse> {
    return await this.request.get(url, {
      params: options?.params,
      headers: options?.headers,
      failOnStatusCode: false,
    });
  }

  async post(url: string, options?: { data?: any; headers?: Record<string, string> }): Promise<APIResponse> {
    return await this.request.post(url, {
      data: options?.data,
      headers: options?.headers,
      failOnStatusCode: false,
    });
  }

  async put(url: string, options?: { data?: any; headers?: Record<string, string> }): Promise<APIResponse> {
    return await this.request.put(url, {
      data: options?.data,
      headers: options?.headers,
      failOnStatusCode: false,
    });
  }

  async delete(url: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    return await this.request.delete(url, {
      headers: options?.headers,
      failOnStatusCode: false,
    });
  }

  async patch(url: string, options?: { data?: any; headers?: Record<string, string> }): Promise<APIResponse> {
    return await this.request.patch(url, {
      data: options?.data,
      headers: options?.headers,
      failOnStatusCode: false,
    });
  }

  static async expectStatus(response: APIResponse, status: number) {
    expect(response.status(), `Expected status ${status} but got ${response.status()}`).to.equal(status);
  }

  static async getJson(response: APIResponse) {
    return await response.json();
  }
}
