#!/usr/bin/env node
import program from 'commander';
import { version } from '../../package.json';
import loadPage from '..';

program
  .version(version, '-v, --version')
  .arguments('<link>')
  .description('Saves a data from a given link')
  .option('-o, --output [directory]', 'Choose directory')
  .action(link => loadPage(link, program.output)
    .then(() => {
      console.log('Loaded sucsessfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    }))
  .parse(process.argv);

