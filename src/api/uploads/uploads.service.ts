import { Req, Res, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import { extname } from 'path';

const AWS_S3_BUCKET_NAME = 'ybiz-tech';
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

@Injectable()
export class UploadsService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async fileupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, function(error) {
        if (error) {
          console.log(error);
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        return res.status(201).json({ filename: req.files[0].key });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: function(request, file, cb) {
        cb(null, `${Date.now().toString()}${extname(file.originalname)}`);
      }
    })
  }).array('upload', 1);

  async RemoveImageS3(key: any) {
    s3.deleteObject({ Bucket: AWS_S3_BUCKET_NAME, Key: key }, (err, _) => {
      if (err) return err;
    });
    return;
  }
}
