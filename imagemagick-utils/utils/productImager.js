const im = require('imagemagick');


const targetWidths = [{ 'subfix': 'url.jpg', 'width': 800 }, { 'subfix': 'big.jpg', 'width': 300 }, { 'subfix': 'small.jpg', 'width': 100 }, { 'subfix': 'thumbnail.jpg', 'width': 60 }];

exports.processProductImage = function (sourceFolder, source, destFolder) {
    if (typeof source === 'string') {
        var baseName = source.substring(0, source.length - 4);
    }
    targetWidths.forEach((item, index) => {
        
        // Needs to refine here as this should be called only one time for each source file
        var promise = new Promise((resolve, reject) => {
            im.identify(sourceFolder + "/" + source, function (err, features) {
                if (err) throw err;
                var minWidth = item.width>features.width?features.width:item.width;
                //console.log("try to get the miner width :"+minWidth);
                resolve(minWidth);
            });
        });
        // console.log("Going here.......");
        promise.then((minWidth) => {
            //console.log("Starting to resize to width:"+minWidth);
            im.resize({
                srcPath: sourceFolder + "/" + source,
                dstPath: destFolder + "/" + baseName + "_" + item.subfix,
                width: minWidth,
                format: 'jpg',
                quality: 0.8
            }, function (err, stdout, stderr) {

                if (err) {
                    console.log('Error happened when resize image: ' + source);
                    throw err;
                }
            });
        });

    });
    //console.log('Finished resize image: ' + source);
}

