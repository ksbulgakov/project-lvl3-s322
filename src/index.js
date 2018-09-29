import url from 'url';
import path from 'path';
import { promises as fsPromises } from 'fs';
import cheerio from 'cheerio';
import axios from './lib/axiosAdapted';
import { makeLocalLink, makeFileName, makeFolderName } from './makeName';


const loadPage = (host, dir = '') => {
  if (!host) {
    throw new Error('No link. Link is requared.');
  }

  return axios.get(host)
    .then((res) => {
      const $ = cheerio.load(res.data);

      const tags = {
        img: 'src',
        link: 'href',
        script: 'src',
      };

      const linksList = Object.keys(tags).reduce((acc, tag) => {
        let links = [];
        $(tag).each(function findLink() {
          const link = $(this).attr(tags[tag]);

          if (!link || url.parse(link).host) {
            return;
          }

          links = [...links, path.normalize(`/${link}`)];
          // Change link to local
          $(this).attr(tags[tag], makeLocalLink(host, link));
        });

        return [...acc, ...links];
      }, []);

      fsPromises.writeFile(`${path.resolve(dir)}/${makeFileName(host)}`, $.html());

      if (linksList.length > 0) {
        fsPromises.mkdir(`${path.resolve(dir)}/${makeFolderName(host)}`)
          .then(() => linksList.forEach(link =>
            axios({
              method: 'get',
              url: `${host}${link}`,
              responseType: 'arraybuffer',
            })
              .then(response => fsPromises
                .writeFile(`${path.resolve(dir)}/${makeLocalLink(host, link)}`, response.data, 'utf8'))));
      }
    });
};

export default loadPage;
