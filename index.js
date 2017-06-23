const fs = require('fs');
const readline = require('readline');
const processProductImage = require('./utils/productImager').processProductImage;
var argv = require('yargs')
    .usage('Usage: $0  [options]')
    .alias('s', 'sourceDirectory').nargs('s', 1).describe('s', 'Source folder where to find source files')
    .alias('d', 'destinationDirectory').nargs('d', 1).describe('d', 'Destination Directory where to put the files')
    .alias('f', 'listFile').nargs('f', 1).describe('f', 'File list which lists files need to be copied')
    .demandOption(['f'])
    .help('h').alias('h', 'help').epilog('copyright 2017')
    .argv;

var sourceFolder = argv.sourceDirectory||'/home/okchem/fileservice/ocf/pubs/image';
var targetFolder = argv.destinationDirectory||'/home/okchem/fileservice/ocf/pubs/pimg';

var lineReader = readline.createInterface({
    input: fs.createReadStream(argv.listFile)
});

lineReader.on('line', function (line) {
  if(line.length>1){
    processProductImage(sourceFolder,line,targetFolder);
  }
});