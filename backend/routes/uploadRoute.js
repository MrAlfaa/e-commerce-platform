import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import config from '../config.js';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename(req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `product-${uniqueSuffix}.${fileExtension}`);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No image file provided' });
    }
    
    // Return the relative path for the frontend to use
    res.send({ 
      message: 'Image uploaded successfully',
      imagePath: `/uploads/products/${req.file.filename}`,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).send({ message: 'Upload failed: ' + error.message });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).send({ message: 'Upload error: ' + error.message });
  }
  if (error) {
    return res.status(400).send({ message: error.message });
  }
  next();
});

aws.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});
const s3 = new aws.S3();
const storageS3 = multerS3({
  s3,
  bucket: 'amazona-bucket',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadS3 = multer({ storage: storageS3 });
router.post('/s3', uploadS3.single('image'), (req, res) => {
  res.send(req.file.location);
});
export default router;
