// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { events } from './events';

export class FetchError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized, login first.');
  }
}

export class NetworkError extends Error {
  constructor() {
    super('Failed when connect server, please check your network');
  }
}

export function fetcher(resource: URL | string | undefined, init?: RequestInit): Promise<any> {
  if (!resource) return Promise.resolve(null);

  return fetch(resource, init)
    .catch(() => {
      throw new NetworkError();
    })
    .then(async (res) => {
      const json = await res.json();

      if (!res.ok) {
        throw new FetchError(json?.message || 'An error occurred while fetching the data.', json?.statusCode || 500);
      }

      if (!json?.code) throw new Error('Wrong response from server');

      if (json.code === 500 && (json.msg === '401 Unauthorized' || json.msg === '403 Invalid Auth Token')) {
        events.emit('unauthorized');
        throw new UnauthorizedError();
      }

      if (json.code >= 200 && json.code < 300) {
        return json;
      } else {
        throw new Error(json?.msg || `Server throw error with code: ${json.code}`);
      }
    });
}
