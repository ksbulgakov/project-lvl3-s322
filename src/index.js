import { promises as fsPromises } from 'fs';
import axios from './lib/axiosAdapted';
import makeFileName from './makeFileName';


const loadPage = (dir, host, option) => {
  if (!option) {
    throw new Error('An action with link content was not chosen');
  }
  return axios.get(host)
    .then(res => fsPromises.writeFile(`${dir}/${makeFileName(host)}`, res.data));
};

export default loadPage;
