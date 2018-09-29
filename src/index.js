import url from 'url';
import path from 'path';
import { promises as fsPromises } from 'fs';
import cheerio from 'cheerio';
import axios from './lib/axiosAdapted';
import { makeLocalLink, makeFileName, makeFolderName } from './makeName';

const handleHtnlData = (res, host) => {
  const $ = cheerio.load(res.data);

  const tags = {
    img: 'src',
    link: 'href',
    script: 'src',
  };

  const links = Object.keys(tags).reduce((acc, tag) => {
    let originalPaths = [];
    $(tag).each(function findLink() {
      const link = $(this).attr(tags[tag]);

      if (!link || url.parse(link).host) {
        return;
      }

      originalPaths = [...originalPaths, path.normalize(`/${link}`)];
      // Change link to local
      $(this).attr(tags[tag], makeLocalLink(host, link));
    });

    return [...acc, ...originalPaths];
  }, []);

  return { htmlDocument: $.html(), links };
};

const loadPage = (host, dir = '') => {
  if (!host) {
    throw new Error('No link. Link is requared.');
  }

  let linksList;

  return axios.get(host)
    .then(res => handleHtnlData(res, host))
    .then((data) => {
      linksList = data.links;
      return fsPromises.writeFile(`${path.resolve(dir)}/${makeFileName(host)}`, data.htmlDocument);
    })
    .then(() => fsPromises.mkdir(`${path.resolve(dir)}/${makeFolderName(host)}`))
    .then(() => Promise.all(linksList.map(link =>
      axios({
        method: 'get',
        url: `${host}${link}`,
        responseType: 'arraybuffer',
      })
        .then((response) => {
          console.log(response);
          return fsPromises.writeFile(`${path.resolve(dir)}/${makeLocalLink(host, link)}`, response.data, 'utf8');
        }))));
};

export default loadPage;
