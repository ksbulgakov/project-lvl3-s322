import fs from 'fs';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import makeFileName from './makeFileName';


const fsPromises = fs.promises;
axios.defaults.adapter = httpAdapter;

const pageLoader = (dir, host, option) => {
  if (option) {
    return axios.get(host)
      .then(res => fsPromises.writeFile(`${dir}/${makeFileName(host)}`, res.data))
      .catch();
  }
  return Promise.reject(new Error('An action with link content was not chosen'));
};

export default pageLoader;
