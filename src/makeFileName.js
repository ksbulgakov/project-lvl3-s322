import url from 'url';
import path from 'path';

export default (host) => {
  const { hostname, pathname } = url.parse(host);
  const regex = /[/.]+/gi;

  return `${path.join(hostname, pathname).replace(regex, '-')}.html`;
};
