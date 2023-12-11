// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function preParams(data: any): any {
  return Object.keys(data)
    .filter((key) => data[key] !== undefined && data[key] !== null)
    .reduce((p, c) => ({ ...p, [c]: data[c] }), {});
}

export function buildQueryString(_params: { [key: string]: any }): string {
  const params = preParams(_params);

  const queryString: string[] = [];

  for (const key in params) {
    if (Object.hasOwnProperty.call(params, key)) {
      const value = params[key];

      if (Array.isArray(value)) {
        value.forEach((item) => {
          queryString.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
        });
      } else {
        queryString.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
  }

  return queryString.join('&');
}
