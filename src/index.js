import url from 'url';
import path from 'path';
import { promises as fsPromises } from 'fs';
import cheerio from 'cheerio';
import debug from 'debug';
import axios from './lib/axios';
import makeName from './makeName';


const handleHtnlData = (res, host) => {
  // logging
  const logHandleHtmlData = debug('page-loader:handle_html_data');
  logHandleHtmlData(`response was got. method:${res.config.method} url:${res.config.url} status:${res.status}`);

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

      originalPaths = [...originalPaths, link];

      // Change link to local
      $(this).attr(tags[tag], makeName(host, link));
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
      return fsPromises
        .writeFile(`${path.resolve(dir)}/${makeName(host)}`, data.htmlDocument);
    })
    .then(() => {
      // logging
      const logCreatingFolder = debug('page-loader:creat_folder');
      logCreatingFolder(`creating folder for files:${makeName(host, 'folder')}`);

      return fsPromises.mkdir(`${path.resolve(dir)}/${makeName(host, 'folder')}`);
    })
    .then(() => Promise.all(linksList.map((link) => {
      // logging
      const logFileLoadingLink = debug('page-loader:loading_file');
      logFileLoadingLink(`loading from ${host}/${link}`);

      return axios({
        method: 'get',
        url: `${host}/${link}`,
        responseType: 'arraybuffer',
      })
        .then((response) => {
          // logging
          const logFileWriting = debug('page-loader:write_file');
          logFileWriting(`writing file ${makeName(host, link)} from ${response.config.url}`);

          return fsPromises.writeFile(`${path.resolve(dir)}/${makeName(host, link)}`, response.data);
        });
    })));
};

export default loadPage;
