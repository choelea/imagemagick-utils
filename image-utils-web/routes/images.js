let router = require('express').Router();
var multer = require('multer');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const im = require('imagemagick');
var zipFolder = require('zip-folder');
var upload = multer({ dest: 'uploads/tmp', limits: { fields: 10, fileSize: '20MB', files: 20 } })

router.get('/', (req, res) => {
    res.render('images/uploader', {
        title: 'Compress Images',
        layout: 'bootstrap',
        myCSSs: ['images.css'],
        myJSs: ['images-uploader.js']
    });
});

router.get('/zip/:uuid', (req, res) => {
    var images = [];
    const uuid = req.params.uuid;
    const dir = 'uploads/' + uuid;
    var returnJson = {};
    zipFolder(dir, 'uploads/' + uuid + ".zip", function (err) {
        if (err) {
            console.log('oh no!', err);
        } else {
            console.log('EXCELLENT');
        }
    });
    res.json({ 'success': true });
});

router.get('/:uuid', (req, res) => {
    var images = [];
    const uuid = req.params.uuid;
    const dir = 'uploads/' + uuid;
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.log(err);
            throw error;
        }
        files.forEach(file => {
            images.push('/uploads/' + uuid + '/' + file);
        });
    });
    res.render('images/compressed-result', {
        title: 'Compressed Images',
        layout: 'bootstrap',
        images: images
    });
});


router.post('/upload', upload.array('images'), function (req, res, next) {
    let uuid = uuidv1();
    let targetFolder = 'uploads/' + uuid;
    fs.mkdir(targetFolder, (error) => { if (error) throw error });
    req.files.forEach(function (file) {
        fs.rename(file.path, targetFolder + "/" + file.originalname, (error) => { if (error) throw error });
        // im.convert([file.path, '-quality', 0.8, 'uploads/'+uuid+"/"+file.originalname],
        //     function (err, stdout) {
        //         if (err) throw err;
        //     });
    }, this);
    res.json({ 'relativePath': uuid });
})
module.exports = router;
