const express = require('express');
const router = express.Router();
const validatetoken = require('../middleware/validatetoken');
const restaurantController = require('../controllers/restaurantController');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
require('dotenv').config();
const crypto = require('crypto');
const path = require('path');

const conn = mongoose.createConnection(process.env.MONGO_URI);

let gfs, gridfsBucket;

conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });


    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

//storage engine
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    options: {
        useUnifiedTopology: true
    },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

// Routes
router.post(
    '/addRestaurant',
    validatetoken,
    upload.fields([{ name: 'image' }, { name: 'menuImage' }]),
    restaurantController.addRestaurant
);

router.put(
    '/updateRestaurant/:id',
    validatetoken,
    upload.fields([{ name: 'image' }, { name: 'menuImage' }]),
    restaurantController.updateRestaurant
);

router.get('/allRestaurant', validatetoken, restaurantController.allRestaurant);
router.get('/allRestaurantForCustomer', validatetoken,restaurantController.allRestaurantForCustomer);
router.delete('/delete/:id', validatetoken, restaurantController.deleteRestaurant);
router.get('/searchRestaurant', validatetoken, restaurantController.searchRestaurant);
router.get('/:id',validatetoken,restaurantController.GetRestaurantById)
// File serving route
// router.get('/images/:filename', async (req, res) => {
//     try {
//         if (!gfs) {
//             return res.status(500).json({
//                 success: false,
//                 message: 'GridFS not initialized'
//             });
//         }

//         const file = await gfs.files.findOne({ filename: req.params.filename });
//         if (!file) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'File not found'
//             });
//         }

//         const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
//             bucketName: 'uploads'
//         });

//         res.set('Content-Type', file.metadata.contentType);
//         const downloadStream = bucket.openDownloadStreamByName(file.filename);
//         downloadStream.pipe(res);
//     } catch (error) {
//         console.error('Error serving file:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching file',
//             error: error.message
//         });
//     }
// });

router.get('/images/:filename', async (req, res) => {
    const { filename } = req.params;
    //console.log(filename);
    // gfs.files.findOne({ filename: filename }, (err, file) => {
    //     if (!file || file.length === 0 || err) {
    //         return res.status(404).json({ error: 'No file exists' });
    //     }
    //     // Check if the file is an image
    //     if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
    //         res.set('Content-Type', file.contentType);
    //         const readStream = gfs.createReadStream(file.filename);
    //         readStream.pipe(res);
    //     } else {
    //         res.status(404).json({ error: 'Not an image' });
    //     }
    // });
    const file = await gfs.files.findOne({ filename: filename });
    const readstream = gridfsBucket.openDownloadStreamByName(file.filename);
    readstream.pipe(res);

});

router.post('/review', validatetoken, restaurantController.addReview);

module.exports = router;