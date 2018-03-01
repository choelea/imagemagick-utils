let router = require('express').Router();
var multer = require('multer');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
// const imageminMozjpeg = require('imagemin-mozjpeg');
const zipFolder = require('zip-folder');
const upload = multer({ dest: 'uploads/tmp', limits: { fields: 10, fileSize: '20MB', files: 20 } })
const compressOption = {
    accurate: true,//高精度模式
    quality: "high",//图像质量:low, medium, high and veryhigh;
    method: "smallfry",//网格优化:mpe, ssim, ms-ssim and smallfry;
    min: 70,//最低质量
    loops: 0,//循环尝试次数, 默认为6;
    progressive: false,//基线优化
    subsample: "default"//子采样:default, disable;
}
const compressImages = async (req, res, next) => {
    try {
        const uuid = uuidv1();
        let targetFolder = 'uploads/' + uuid + '/';
        fs.mkdir(targetFolder, (error) => { if (error) throw error });
        const arrFiles = []
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const destPath = 'uploads/tmp/' + file.originalname
            fs.renameSync(file.path, destPath)
            // await fs.copyFileSync(file.path, destPath)
            arrFiles.push(destPath)
            // await fs.unlinkSync(file.path) 
        }
        await imagemin(arrFiles, targetFolder, {
            use: [
                // imageminJpegRecompress({ quality: 80 })
                imageminJpegRecompress(compressOption)
                // imageminJpegtran()
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
        let targetFolder = 'uploads/' + uuidv1();
        const file = req.file;
        fs.mkdir(targetFolder, (error) => { if (error) throw error });
        const destPath = targetFolder + file.originalname;
        fs.copyFileSync(file.path, destPath);
        const arrFiles = [destPath];
        fs.unlinkSync(file.path);
        await imagemin(arrFiles, targetFolder, {
            use: [
                // imageminJpegRecompress({ quality: 80 })
                imageminJpegRecompress(compressOption)                
                // imageminJpegtran()
            ]
        });
        res.json({ url: `http://${req.hostname}/${destPath}` });
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
            throw err;
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

router.post('/uploadone', upload.single('image'), compressImage)
module.exports = router;
