#! /usr/bin/env node
import { addTpl, selectTpl } from '../inquirer/index.js'
import { Command } from 'commander'

const program = new Command()

program
  .version('1.0.0')
  .command('add tpl')
  .description('add template')
  .action(() => { addTpl()})

  program
  .version('1.0.0')
  .command('load tpl')
  .description('see template')
    .action(() => { selectTpl()})

  program.parse()