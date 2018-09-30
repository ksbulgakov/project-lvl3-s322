import { promises as fsPromises } from 'fs';
import os from 'os';
import path from 'path';
import nock from 'nock';
import loadPage from '../src/';

nock.disableNetConnect();
describe('Save hello world', () => {
  it('get file content', async () => {
    const host = 'https://ru.hexlet.io';
    const pathname = '/courses';
    const status = 200;
    const body = '<html><head></head><body>hello, world</body></html>';

    nock(host)
      .get(pathname)
      .reply(status, body);

    const folderName = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'loadedPage-'));
    await loadPage(`${host}${pathname}`, folderName);
    const pathToFile = path.join(folderName, '/ru-hexlet-io-courses.html');
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

describe('Save site', () => {
  beforeEach(async () => {
    const status = 200;
    const host = 'https://ru.hexlet.io';

    const pathToHtmlFile = path.join(__dirname, '/__fixtures__/site/index.html');
    const bodyHtml = await fsPromises.readFile(pathToHtmlFile, 'utf8');

    const pathToCssFile = path.join(__dirname, '/__fixtures__/site/site_files/css/style.css');
    const bodyCss = await fsPromises.readFile(pathToCssFile, 'utf8');

    const pathToImageFile = path.join(__dirname, '/__fixtures__/site/site_files/image.jpg');
    const bodyImage = await fsPromises.readFile(pathToImageFile, 'utf8');

    const pathToScriptFile = path.join(__dirname, '/__fixtures__/site/site_files/script.js');
    const bodyScript = await fsPromises.readFile(pathToScriptFile, 'utf8');

    nock(host)
      .get('/courses')
      .reply(status, bodyHtml)
      .get('/courses/site_files/css/style.css')
      .reply(status, bodyCss)
      .get('/courses/site_files/image.jpg')
      .reply(status, bodyImage)
      .get('/courses/site_files/script.js')
      .reply(status, bodyScript);
  });

  it('check index content', async () => {
    const folderName = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'loadedPage-'));
    await loadPage('https://ru.hexlet.io/courses', folderName);

    const pathToExpectedHtmlFile = path
      .join(__dirname, '/__fixtures__/expected/ru-hexlet-io-courses.html');
    const expectedHtml = await fsPromises.readFile(pathToExpectedHtmlFile, 'utf8');
    const pathToSavedHtml = path.join(folderName, '/ru-hexlet-io-courses.html');
    const contentHtml = await fsPromises.readFile(pathToSavedHtml, 'utf8');
    expect(contentHtml).toBe(expectedHtml);
  });


  it('check css content', async () => {
    const folderName = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'loadedPage-'));
    await loadPage('https://ru.hexlet.io/courses', folderName);

    const pathToExpectedCssFile = path
      .join(__dirname, '/__fixtures__/expected/ru-hexlet-io-courses_files/site_files-css-style.css');
    const expectedCss = await fsPromises.readFile(pathToExpectedCssFile, 'utf8');
    const pathToSavedCss = path.join(folderName, '/ru-hexlet-io-courses_files/site_files-css-style.css');
    const contentCss = await fsPromises.readFile(pathToSavedCss, 'utf8');
    expect(contentCss).toBe(expectedCss);
  });


  it('check script content', async () => {
    const folderName = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'loadedPage-'));
    await loadPage('https://ru.hexlet.io/courses', folderName);

    const pathToExpectedScriptFile = path
      .join(__dirname, '/__fixtures__/expected/ru-hexlet-io-courses_files/site_files-script.js');
    const expectedScript = await fsPromises.readFile(pathToExpectedScriptFile, 'utf8');
    const pathToSavedScript = path.join(folderName, '/ru-hexlet-io-courses_files/site_files-script.js');
    const contentScript = await fsPromises.readFile(pathToSavedScript, 'utf8');
    expect(contentScript).toBe(expectedScript);
  });


  it('check image content', async () => {
    const folderName = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'loadedPage-'));
    await loadPage('https://ru.hexlet.io/courses', folderName);

    const pathToExpectedImgFile = path
      .join(__dirname, '/__fixtures__/expected/ru-hexlet-io-courses_files/site_files-image.jpg');
    const expectedImg = await fsPromises.readFile(pathToExpectedImgFile, 'utf8');
    const pathToSavedImg = path.join(folderName, '/ru-hexlet-io-courses_files/site_files-image.jpg');
    const contentImg = await fsPromises.readFile(pathToSavedImg, 'utf8');
    expect(contentImg).toBe(expectedImg);
  });
});
