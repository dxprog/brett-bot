import config from '../../config';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export async function call(method: HttpMethod, endpoint: string, data?: any) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `https://${config.url}/${endpoint}`, true);

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.statusText);
      }
    });

    if (method !== HttpMethod.GET) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  });
}

export async function post(endpoint: string, data: any) {
  return call(HttpMethod.POST, endpoint, data);
}

export async function get(endpoint: string) {
  return call(HttpMethod.GET, endpoint);
}