import type { APIRequestContext, APIResponse } from "playwright";
import type { RuntimeConfig } from "../config/runtimeConfig.ts";

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: any;
  timeout?: number;
}

/**
 * ApiActions — Utility for performing API requests.
 * Provides wrappers for common HTTP methods with built-in logging.
 */
export class ApiActions {
  private readonly request: APIRequestContext;
  private readonly runtime: RuntimeConfig;

  constructor(request: APIRequestContext, runtime: RuntimeConfig) {
    this.request = request;
    this.runtime = runtime;
  }

  private logRequest(method: string, url: string, options?: ApiRequestOptions) {
    console.log(`\n[API REQUEST] ${method.toUpperCase()} ${url}`);
    if (options?.params) console.log(`  Params: ${JSON.stringify(options.params)}`);
    if (options?.data) console.log(`  Data: ${JSON.stringify(options.data)}`);
  }

  private async logResponse(response: APIResponse) {
    const status = response.status();
    console.log(`[API RESPONSE] Status: ${status} ${response.statusText()}`);
    try {
      const body = await response.text();
      console.log(`  Body: ${body.substring(0, 500)}${body.length > 500 ? "..." : ""}`);
    } catch (e) {
      console.log(`  Could not read body: ${e}`);
    }
  }

  async get(url: string, options?: ApiRequestOptions): Promise<APIResponse> {
    this.logRequest("GET", url, options);
    const response = await this.request.get(url, {
      params: options?.params,
      headers: options?.headers,
      failOnStatusCode: false,
    });
    await this.logResponse(response);
    return response;
  }

  async post(url: string, options?: ApiRequestOptions): Promise<APIResponse> {
    this.logRequest("POST", url, options);
    const response = await this.request.post(url, {
      params: options?.params,
      headers: options?.headers,
      data: options?.data,
      failOnStatusCode: false,
    });
    await this.logResponse(response);
    return response;
  }

  async put(url: string, options?: ApiRequestOptions): Promise<APIResponse> {
    this.logRequest("PUT", url, options);
    const response = await this.request.put(url, {
      params: options?.params,
      headers: options?.headers,
      data: options?.data,
      failOnStatusCode: false,
    });
    await this.logResponse(response);
    return response;
  }

  async delete(url: string, options?: ApiRequestOptions): Promise<APIResponse> {
    this.logRequest("DELETE", url, options);
    const response = await this.request.delete(url, {
      params: options?.params,
      headers: options?.headers,
      failOnStatusCode: false,
    });
    await this.logResponse(response);
    return response;
  }

  /**
   * Helper to validate status codes
   */
  static async expectStatus(response: APIResponse, expectedStatus: number) {
    const actual = response.status();
    if (actual !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus} but got ${actual}`);
    }
  }

  /**
   * Helper to parse JSON body
   */
  static async getJson(response: APIResponse): Promise<any> {
    return await response.json();
  }
}
