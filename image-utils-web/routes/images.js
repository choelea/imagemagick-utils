let router = require('express').Router();
var multer = require('multer');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
var zipFolder = require('zip-folder');
var upload = multer({ dest: (process.env.uploadPath || 'uploads')+'/tmp', limits: { fields: 10, fileSize: '20MB', files: 20 } })
const compressImages = async (req, res, next) => {
    try {
        const uuid = uuidv1();
        let targetFolder = process.env.uploadPath + uuid + '/';
        fs.mkdir(targetFolder, (error) => { if (error) throw error });
        const arrFiles = []
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const destPath = targetFolder + file.originalname
            await fs.copyFileSync(file.path, destPath)
            arrFiles.push(destPath)
            await fs.unlinkSync(file.path)
        }
        await imagemin(arrFiles, targetFolder, {
            use: [
                imageminMozjpeg({ quality: 80 })
            ]
        });
        console.log('Images optimized');
        res.json({ uuid, count: req.files.length });
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Error Happened!' })
    }
}
const compressImage = async (req, res, next) => {
    try {
        let targetFolder = process.env.uploadPath + uuidv1();
        const file = req.file;
        fs.mkdir(targetFolder, (error) => { if (error) throw error });
        const destPath = targetFolder + file.originalname;
        fs.copyFileSync(file.path, destPath);
        const arrFiles = [destPath];
        fs.unlinkSync(file.path);
        await imagemin(arrFiles, targetFolder, {
            use: [
                imageminMozjpeg({ quality: 80 })
            ]
        });
        res.json({ url: 'http://localhost:4000/' + destPath });
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Error Happened!' })
    }
}
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
    const dir = process.env.uploadPath + uuid;
    var returnJson = {};
    zipFolder(dir, process.env.uploadPath + uuid + ".zip", function (err) {
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
router.post('/upload', upload.array('images'), compressImages)

router.post('/uploadone', upload.single('image'), (req, res, next) => {
    let uuid = uuidv1();
    let targetFolder = process.env.uploadPath + uuid;
    const file = req.file
    fs.mkdir(targetFolder, (error) => { if (error) throw error });
    const targetPath = targetFolder + "/" + file.originalname;
    // im.convert([file.path, '-quality', 80, targetPath], function (err, stdout) {
    //     if (err) throw err;
    // })
    const url = req.do
    res.json({ url: 'http://localhost:4000/' + targetPath });
})
module.exports = router;
