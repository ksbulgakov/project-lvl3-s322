import { promises as fsPromises } from 'fs';
import os from 'os';
import path from 'path';
import nock from 'nock';
import makeFileName from '../src/makeFileName';
import loadPage from '../src/';

nock.disableNetConnect();

describe('Page Loader', () => {
  it('get file content', async () => {
    const host = 'https://hexlet.io';
    const pathname = '/courses';
    const status = 200;
    const body = 'hello, world';
    const option = true;

    nock(host)
      .get(pathname)
      .reply(status, body);

    const folderName = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'loadedPage-'));

    await loadPage(folderName, `${host}${pathname}`, option);

    const pathToFile = path.join(folderName, makeFileName(`${host}${pathname}`));
    const fileContent = await fsPromises.readFile(pathToFile, 'utf8');
    expect(fileContent).toBe(body);
  });

  it('error', async () => {
    const host = 'https://hexlet.io';
    const pathname = '/courses';
    const option = true;

    nock(host)
      .get(pathname)
      .replyWithError('timeout error');

    const folderName = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'loadedPage-'));

    try {
      await loadPage(folderName, `${host}${pathname}`, option);
    } catch (error) {
      expect(error.message).toMatch('timeout error');
    }
  });

  it('option was not inputed', async () => {
    const host = 'https://hexlet.io';
    const pathname = '/courses';
    const status = 200;
    const body = 'hello, world';
    const option = false;

    nock(host)
      .get(pathname)
      .reply(status, body);

    const folderName = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'loadedPage-'));

    try {
      await loadPage(folderName, `${host}${pathname}`, option);
    } catch (error) {
      expect(error.message).toMatch('An action with link content was not chosen');
    }
  });
});

