import url from 'url';
import path from 'path';
import { promises as fsPromises } from 'fs';
import cheerio from 'cheerio';
import debug from 'debug';
import Listr from 'listr';
import axios from './lib/axios';
import makeName from './makeName';
import makeError from './makeError';


const handleHtmlData = (res, host) => {
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
      $(this).attr(tags[tag], makeName(host, link));
    });
    return [...acc, ...originalPaths];
  }, []);

  return { htmlDocument: $.html(), links };
};

const saveFiles = (linksList, host, dir) => Promise.all(linksList
  .map((link) => {
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
  }));


const loadPage = (host = null, dir = '') => {
  if (!host) {
    throw new Error('No link. Link is requared.');
  }

  let linksList;
  const tasks = new Listr([
    {
      title: 'Checking if directory exists',
      task: () => {
        // logging
        const logCreatingFolder = debug('page-loader:check_directory');
        logCreatingFolder(`Checking if dirrectory ${path.resolve(dir)} exists`);

        return fsPromises.realpath(`${path.resolve(dir)}`);
      },
    },
    {
      title: 'Loading',
      task: () => axios.get(host)
        .then(res => handleHtmlData(res, host))
        .then((data) => {
          linksList = data.links;
          return fsPromises
            .writeFile(`${path.resolve(dir)}/${makeName(host)}`, data.htmlDocument);
        })
      ,
    },
    {
      title: 'Creating directory for files',
      task: () => {
        // logging
        const logCreatingFolder = debug('page-loader:create_folder');
        logCreatingFolder(`creating folder for files:${makeName(host, 'folder')}`);
        return fsPromises.mkdir(`${path.resolve(dir)}/${makeName(host, 'folder')}`);
      },
    },
    {
      title: 'Saving files',
      task: () => saveFiles(linksList, host, dir),
    },
  ]);

  return tasks.run()
    .catch((err) => {
      const newError = makeError(err);
      const logError = debug('page-loader:ERROR');
      logError(`Error code: ${newError.code}`);
      throw makeError(err);
    });
};

export default loadPage;
