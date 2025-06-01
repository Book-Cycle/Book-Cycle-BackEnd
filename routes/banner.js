const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const bannerDir = path.join(__dirname, '..', 'uploads', 'banners');

if (!fs.existsSync(bannerDir)) {
    fs.mkdirSync(bannerDir, { recursive: true });
}

// multer 저장소(storage) 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, bannerDir),

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// POST /api/upload/banner 요청 처리
router.post('/', (req, res, next) => {
    upload.single('banner')(req, res, (err) => {
        if (err) return next(err);
        if (!req.file) return res.status(400).send('No banner image uploaded.');
        const imageUrl = `/uploads/banners/${req.file.filename}`;
        res.json({ message: 'Banner uploaded', imageUrl });
    });
});

module.exports = router;
