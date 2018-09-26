import fs from 'fs';
import os from 'os';
import path from 'path';
import nock from 'nock';
import makeFileName from '../src/makeFileName';
import pageLoader from '../src/';

const fsPromises = fs.promises;

nock.disableNetConnect();

describe('Page Loader', () => {
  it('get file content', async (done) => {
    const host = 'https://hexlet.io';
    const pathname = '/courses';
    const status = 200;
    const body = 'hello, world';
    const option = true;

    nock(host)
      .get(pathname)
      .reply(status, body);

    fs.mkdtemp(path.join(os.tmpdir(), 'pageLoader-'), async (err, folder) => {
      if (err) throw err;
      await pageLoader(folder, `${host}${pathname}`, option)
        .then(async () => {
          const pathToFile = path.join(folder, makeFileName(`${host}${pathname}`));
          const fileContent = await fsPromises.readFile(pathToFile, 'utf8');
          expect(fileContent).toBe(body);
          done();
        });
    });
  });

  it('error', async (done) => {
    const host = 'https://hexlet.io';
    const pathname = '/courses';
    const option = true;

    nock(host)
      .get(pathname)
      .replyWithError('timeout error');

    fs.mkdtemp(path.join(os.tmpdir(), 'pageLoader-'), async (err, folder) => {
      if (err) throw err;
      expect.assertions(1);
      try {
        await pageLoader(folder, `${host}${pathname}`, option);
      } catch (error) {
        expect(error.message).toMatch('timeout error');
        done();
      }
    });
  });

  it('option was not inputed', async (done) => {
    const host = 'https://hexlet.io';
    const pathname = '/courses';
    const status = 200;
    const body = 'hello, world';
    const option = false;

    nock(host)
      .get(pathname)
      .reply(status, body);

    fs.mkdtemp(path.join(os.tmpdir(), 'pageLoader-'), async (err, folder) => {
      if (err) throw err;
      expect.assertions(1);
      try {
        await pageLoader(folder, `${host}${pathname}`, option);
      } catch (error) {
        expect(error.message).toMatch('An action with link content was not chosen');
        done();
      }
    });
  });
});

