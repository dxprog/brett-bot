export function post(endpoint: string, data: any) {
  const xhr = new XMLHttpRequest();
  const postData = Object.keys(data).map(key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
  }).join('&');
  xhr.open('POST', `https://api.brettbot.app/${endpoint}`, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(postData);
}