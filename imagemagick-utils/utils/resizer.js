const fs = require('fs');
const im = require('imagemagick');

exports.resizer = function (folderPath,width,quality) {
    console.log('folder path is : '+folderPath);
    fs.readdir(folderPath, (err, files) => {
        files.forEach(file => {
            im.resize({
                srcPath: folderPath+"/"+file,
                dstPath: folderPath+"/"+file,
                width: width,
                format: 'jpg',
                quality: quality
            }, function (err, stdout, stderr) {

                if (err) {
                    console.log('Error happened when resize image: ' + source);
                    throw err;
                }
            });
        });
    });
}
