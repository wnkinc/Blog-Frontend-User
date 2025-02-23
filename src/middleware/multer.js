const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

// Configure AWS (ensure your credentials/role allow S3 access)
const s3 = new S3Client({ region: "us-east-1" });

// Set up multer to use S3 for storage
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "blogapiimagebucket", // Replace with your S3 bucket name
    acl: "public-read", // Adjust ACL as needed (public-read or private)
    key: function (req, file, cb) {
      // Create a unique file name using the current timestamp
      const fileName = `uploads/${Date.now()}_${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

module.exports = upload;
