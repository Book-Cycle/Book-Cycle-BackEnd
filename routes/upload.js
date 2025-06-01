const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// 파일 업로드
router.post('/', (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
        if (err) return next(err);
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No images uploaded.');
        }

        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        res.json({ message: 'Images uploaded', imageUrls });
    });
});

// 파일 삭제
router.delete('/', (req, res) => {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl이 필요합니다.' });

    const filename = path.basename(imageUrl);
    const filePath = path.join(uploadDir, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('파일 삭제 실패:', err);
            return res.status(500).json({ error: '파일 삭제 실패' });
        }
        res.json({ message: '파일이 성공적으로 삭제되었습니다.' });
    });
});

// 업로드된 목록
router.get('/', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).json({ error: '파일 목록을 불러올 수 없습니다.' });
        const imageUrls = files.map(file => `/uploads/${file}`);
        res.json({ imageUrls });
    });
});

module.exports = router;