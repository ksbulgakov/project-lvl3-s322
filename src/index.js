import path from 'path';
import { promises as fsPromises } from 'fs';
import axios from './lib/axiosAdapted';
import makeFileName from './makeFileName';


const loadPage = (host, dir = '') => {
  if (!host) {
    throw new Error('No link. Link is requared.');
  }
  return axios.get(host)
    .then(res => fsPromises.writeFile(`${path.resolve(dir)}/${makeFileName(host)}`, res.data));
};

export default loadPage;
