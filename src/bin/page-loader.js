#!/usr/bin/env node
import program from 'commander';
import { version } from '../../package.json';
import loadPage from '..';

program
  .version(version, '-v, --version')
  .arguments('<directory> <link>')
  .description('Saves a data from a given link.')
  .option('-o, --output', 'Save data')
  .action((directory, link) => loadPage(directory, link, program.output))
  .parse(process.argv);

