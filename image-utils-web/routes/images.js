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
            throw err
        }
    });
    res.json({ 'success': true, 'url': '/uploads/' + uuid + ".zip" });
});

router.get('/:uuid/:count', (req, res) => {
    const count = req.params.count;
    const uuid = req.params.uuid;
    var images = [];
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
        uuid: uuid,
        images: images
    });
});

router.get('/words', async (req, res) => {
    const { userId } = req.query;
    const wordsSnapshot = await db.ref(`words/${userId}`).once('value');
    res.send(wordsSnapshot.val())
});

/** upload images: 1, upload to uploads/tmp */
router.post('/upload', upload.array('images'), (req, res, next) => {
    let uuid = uuidv1();
    let targetFolder = 'uploads/' + uuid;
    fs.mkdir(targetFolder, (error) => { if (error) throw error });
    for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i]
        const targetPath = targetFolder + "/" + file.originalname;
        // fs.rename(file.path, targetPath, (error) => { if (error) throw error });

        im.convert([file.path, '-quality', 80, targetPath], function (err, stdout) {
            if (err) throw err;
        })
    }
    res.json({ uuid, count: req.files.length });
})

router.post('/uploadone', upload.single('image'), (req, res, next) => {
    let uuid = uuidv1();
    let targetFolder = 'uploads/' + uuid;
    const file = req.file
    fs.mkdir(targetFolder, (error) => { if (error) throw error });
    const targetPath = targetFolder + "/" + file.originalname;
    im.convert([file.path, '-quality', 80, targetPath], function (err, stdout) {
        if (err) throw err;
    })
    const url = req.do
    res.json({ url: 'http://localhost:3000/' + targetPath });
})
module.exports = router;
