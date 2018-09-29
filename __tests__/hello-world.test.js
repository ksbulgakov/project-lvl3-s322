import { promises as fsPromises } from 'fs';
import os from 'os';
import path from 'path';
import nock from 'nock';
import { makeFileName } from '../src/makeName';
import loadPage from '../src';

nock.disableNetConnect();

describe('Save hello world', () => {
  it('get file content', async () => {
    const host = 'https://hexlet.io';
    const pathname = '/courses';
    const status = 200;
    const body = '<html><head></head><body>hello, world</body></html>';

    nock(host)
      .get(pathname)
      .reply(status, body);

    const folderName = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'loadedPage-'));
    await loadPage(`${host}${pathname}`, folderName);
    const pathToFile = path.join(folderName, makeFileName(`${host}${pathname}`));
    const fileContent = await fsPromises.readFile(pathToFile, 'utf8');
    expect(fileContent).toBe(body);
  });

  it('error', async () => {
    const host = 'https://hexlet.io';
    const pathname = '/courses';

    nock(host)
      .get(pathname)
      .replyWithError('timeout error');

    const folderName = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'loadedPage-'));
    try {
      await loadPage(`${host}${pathname}`, folderName);
    } catch (error) {
      expect(error.message).toMatch('timeout error');
    }
  });

  it('no link', async () => {
    const folderName = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'loadedPage-'));
    try {
      await loadPage('', folderName);
    } catch (error) {
      expect(error.message).toMatch('No link. Link is requared.');
    }
  });
});
