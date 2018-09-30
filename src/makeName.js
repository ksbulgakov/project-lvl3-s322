import url from 'url';
import path from 'path';


export default (host, arg = '') => {
  const regex = /\W+/gi;

  const { hostname, pathname } = url.parse(host);
  const firstName = `${path.join(hostname, pathname).replace(regex, '-')}`;

  if (arg === 'folder') {
    return `${firstName}_files`;
  }
  if (!arg) {
    return `${firstName}.html`;
  }

  const { dir, base } = path.parse(arg);
  const resourceName = `${dir.replace(regex, '-')}-${base}`;
  return `${firstName}_files/${resourceName}`;
};
