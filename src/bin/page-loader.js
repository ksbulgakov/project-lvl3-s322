#!/usr/bin/env node
import program from 'commander';
import { version } from '../../package.json';
import loadPage from '..';

program
  .version(version, '-v, --version')
  .arguments('<link>')
  .description('Saves a data from a given link')
  .option('-o, --output [directory]', 'Choose directory')
  .action(link => loadPage(link, program.output))
  .parse(process.argv);

