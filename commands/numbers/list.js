const Nexmo = require('nexmo');
const Table = require('cli-table3');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

module.exports = (args, options, logger) => {
  // get creds from global config
  const nexmo = new Nexmo(
    {
      apiKey: config.key,
      apiSecret: config.secret
    }
  )

  let opts = {}

  if (options.size) {
    opts.size = options.size;
  }

  if (options.page) {
    opts.index = options.page;
  }

  if (options.appId) {
    opts.application_id = options.appId
  }

  if (options.hasApp) {
    opts.has_application = options.hasApp
  }

  if (options.country) {
    opts.country = options.country
  }

  if (options.pattern) {
    opts.pattern = options.pattern
    // set a default search pattern so this will work by itself
    opts.search_pattern = 1;
  }
  
  if (options.searchPattern) {
    if (options.searchPattern == "start" || options.searchPattern == "starts") {
      opts.search_pattern = 0;
    } else if (options.searchPattern == "end" || options.searchPattern == "ends") {
      opts.search_pattern = 2;
    } else {
      opts.search_pattern = 1;
    }
  }

  nexmo.number.get(opts, (err, res) => {
    if (err) {
      logger.error(err.body)
    } else if ( !res.numbers ) {
      logger.debug("No numbers found")
    } else {
      if (options.format == "json") {
        logger.info(JSON.stringify(res.numbers, null, 2));
      } else if (options.format == "csv") {
        const csvStringifier = createCsvStringifier({
          header: [
            {id: 'number', title: 'Number'},
            {id: 'features', title: 'Features'},
            {id: 'app_id', title: 'App ID'}
          ]
        });
        
        let records = [];
        res.numbers.forEach((number) => {
          records.push({number: number.msisdn, features: number.features.join(), app_id: number.app_id});
        });

        logger.info(csvStringifier.getHeaderString().trim());
        logger.info(csvStringifier.stringifyRecords(records));
      } else {
        var table = new Table({
            head: ['Number', 'Features', 'App ID']
          , colWidths: [16, 12, 38]
          , style: {head: ['brightYellow']}
        });

        res.numbers.forEach((number) => {
          table.push([number.msisdn, number.features.join(), number.app_id])

        });

        logger.info(table.toString());
      }

    }
  });

};
