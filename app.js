const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

const usersRouter = require('./routes/users');
const productRouter = require('./routes/product_posts');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

app.use(express.json());

// 정적 파일 제공 (public 폴더)
app.use(express.static('public'));

// uploads 폴더 경로 및 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
// banner 폴더 경로 및 생성
const bannerDir = path.join(__dirname, 'uploads', 'banners');
if (!fs.existsSync(bannerDir)) {
    fs.mkdirSync(bannerDir, { recursive: true });
}

// multer 저장소 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// multer 인스턴스 생성 (최대 파일 크기: 10MB)
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB 제한
});

// 단일/다중 파일 업로드 처리 (key: images)
app.post('/api/upload', (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
        if (err) return next(err);

        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No images uploaded.');
        }

        // 업로드된 파일 경로 배열 생성
        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

        res.json({ message: 'Images uploaded', imageUrls });
    });
});

const bannerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/banners/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadBanner = multer({ storage: bannerStorage });


// 배너 파일 업로드 처리 (key : banner)
app.post('/api/upload/banner', (req, res, next) => {
    uploadBanner.single('banner')(req, res, (err) => {
        if (err) return next(err);

        if (!req.file) {
            return res.status(400).send('No banner image uploaded.');
        }

        const imageUrl = `/uploads/banners/${req.file.filename}`;
        res.json({ message: 'Banner uploaded', imageUrl });
    });
});

// 이미지 삭제 API
app.delete('/api/upload', (req, res) => {
    const { imageUrl } = req.body;


    if (!imageUrl) {
        return res.status(400).json({ error: 'imageUrl이 필요합니다.' });
    }

    // imageUrl 예: "/uploads/1651234567890-filename.jpg"
    // 실제 서버 경로로 변환
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, 'uploads', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('파일 삭제 실패:', err);
            return res.status(500).json({ error: '파일 삭제 실패' });
        }

        res.json({ message: '파일이 성공적으로 삭제되었습니다.' });
    });
});

// 라우터 연결
app.use('/api/users', usersRouter);
app.use('/api/product_posts', productRouter);
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);

// 업로드된 파일 정적 제공
app.use('/uploads', express.static(uploadDir));

// 예제 응답
app.get('/api/data', (req, res) => {
    res.json({ message: '데이터 응답' });
});

// multer 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: '파일 크기가 10MB를 초과했습니다.' });
        }
        return res.status(400).json({ error: err.message });
    }
    next(err);
});

module.exports = app;
