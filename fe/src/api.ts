export function post(endpoint: string, data: any) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `https://api.brettbot.app/${endpoint}`, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));
}