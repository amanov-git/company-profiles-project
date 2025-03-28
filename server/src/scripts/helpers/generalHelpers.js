const multer = require('multer');

const multerDiskStorage = () => {
  const fileSavePath = path.join(process.cwd(), 'src/images')
  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fileSavePath)
    },
    filename: (req, file, cb) => {
      const filename = getSeperatedFilename(file.originalname)
      const fullFileName = filename.filename + '-' + new Date().getTime() + '.' + filename.ext
      cb(null, fullFileName)
    }
  })

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "image/gif" ||
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'), false)
    }
  }

  const uploader = multer({
    storage: diskStorage,
    fileFilter
  })
  return uploader
};

const multerMemoryStorage = () => {
  const storage = multer.memoryStorage()

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "image/gif" ||
      file.mimetype === "image/jfif" ||
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'), false)
    }
  }

  const uploader = multer({
    storage: storage,
    fileFilter
  })
  return uploader
};

module.exports = {
  multerDiskStorage,
  multerMemoryStorage,
};