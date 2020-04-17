const fs = require("fs")

module.exports = (args, options, logger) => {
  let config_filename = ".config.json";
  if (options.apiKey) {
    config.key = options.apiKey;
  }
  if (options.apiSecret) {
    config.secret = options.apiSecret;
  }

  fs.writeFileSync(config_filename, JSON.stringify(config));

};

