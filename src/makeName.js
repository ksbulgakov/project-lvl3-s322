import url from 'url';
import path from 'path';

export const makeLocalLink = (host, pathToFile) => {
  const { base } = path.parse(pathToFile);
  const { hostname, pathname } = url.parse(host);
  const regex = /[/.]+/gi;
  return `${path.join(hostname, pathname).replace(regex, '-')}_files/${base}`;
};

export const makeFileName = (host) => {
  const { hostname, pathname } = url.parse(host);
  const regex = /[/.]+/gi;

  return `${path.join(hostname, pathname).replace(regex, '-')}.html`;
};

export const makeFolderName = (host) => {
  const { hostname, pathname } = url.parse(host);
  const regex = /[/.]+/gi;

  return `${path.join(hostname, pathname).replace(regex, '-')}_files`;
};

