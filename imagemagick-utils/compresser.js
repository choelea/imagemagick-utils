const fs = require('fs');
const readline = require('readline');
const compress = require('./utils/compresser.js').compress;
var argv = require('yargs')
    .usage('Usage: $0  [options]')
    .alias('s', 'sourceDirectory').nargs('s', 1).describe('s', 'Source folder where to find source files')
    .alias('q', 'quality').nargs('q', 1).describe('q', 'quality to compress, default: 0.8')
    .demandOption(['s'])
    .help('h').alias('h', 'help').epilog('copyright 2017')
    .argv;

var width = argv.width;
var quality = argv.quality|| 0.8;
var sourceFolder = argv.sourceDirectory||'/data/news/images';
console.log('source folder is :'+sourceFolder);
compress(sourceFolder,quality);