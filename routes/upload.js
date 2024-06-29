// routes/upload.js
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const router = express.Router();
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), (req, res) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: req.file.filename,
    Body: fs.createReadStream(req.file.path),
  };
  s3.upload(params, (err, data) => {
    if (err) return res.status(500).send(err);
    res.send(data);
  });
});

module.exports = router;