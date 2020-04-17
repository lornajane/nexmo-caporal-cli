const prog = require('caporal');
const fs = require("fs")

// start with empty config
global.config = {};

// then load config from default filename if it's there
var config_filename = ".config.json";
if (fs.existsSync(config_filename)) {
  config = JSON.parse(fs.readFileSync(config_filename));
}

// require all the various command files, this could be neater
const numbers_list = require('./commands/numbers/list')
const setup = require('./commands/setup')

prog.version('0.0.1');
prog.help('This is a simple CLI to work with Vonage APIs');

prog.command('setup', 'Configure this tool')
  .help("Set login configuration and other settings")
  .option('--api-key <key>', 'Find your API key in the Dashboard')
  .option('--api-secret <secret>', 'Find your API secret in the Dashboard')
  .action(setup)

prog.command('number list', 'List the numbers you own')
  .help("Show all the numbers currently associated with your Nexmo account")
  .option('-f, --format <format>', 'Output format, table, csv or json (default: table)', ["table", "json", "csv"])
  .option('--app-id <application_id>', 'Show only numbers associated with this application ID')
  .option('--has-app <has-app>', 'Numbers associated with an application (or not associated with an application)', ["true", "false"])
  .option('--country <country-code>', 'Filter numbers by 2-character country code, e.g. GB, US')
  .option('--pattern <pattern>', 'Pattern of numbers to search for (use with --search-pattern)')
  .option('--search-pattern <type>', 'Where to search for the pattern (starts, ends, or contains)', ["start", "starts", "end", "ends", "contain", "contains"])
  .option('--size <size>', 'How many results to return (default: 10)')
  .option('--page <page>', 'Which page of results to show (default: 1)')
  .action(numbers_list);

prog.parse(process.argv);
