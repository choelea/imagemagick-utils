const fs = require('fs');
const readline = require('readline');
const resizer = require('./utils/resizer').resizer;
var argv = require('yargs')
    .usage('Usage: $0  [options]')
    .alias('s', 'sourceDirectory').nargs('s', 1).describe('s', 'Source folder where to find source files')
    .alias('w', 'width').nargs('w', 1).describe('w', 'Width to resize to')
    .alias('q', 'quality').nargs('q', 1).describe('q', 'quality to compress, default: 0.8')
    .demandOption(['s','w'])
    .help('h').alias('h', 'help').epilog('copyright 2017')
    .argv;

var width = argv.width;
var quality = argv.quality|| 0.8;
var sourceFolder = argv.sourceDirectory||'/data/news/images';
console.log('source folder is :'+sourceFolder);
resizer(sourceFolder,width,quality);