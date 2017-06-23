const processProductImage = require('../utils/productImager').processProductImage;

var argv = require('yargs')
    .usage('Usage: $0  [options]')
    .alias('s', 'sourceFile').nargs('s', 1).describe('s', 'Source file')
    .demandOption(['s'])
    .help('h').alias('h', 'help').epilog('copyright 2017')
    .argv;


processProductImage(argv.sourceFile);