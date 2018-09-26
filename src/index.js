import { promises as fsPromises } from 'fs';
import axios from './lib/axiosAdapted';
import makeFileName from './makeFileName';


const pageLoader = (dir, host, option) => {
  if (option) {
    return axios.get(host)
      .then(res => fsPromises.writeFile(`${dir}/${makeFileName(host)}`, res.data));
  }
  throw new Error('An action with link content was not chosen');
};

export default pageLoader;
