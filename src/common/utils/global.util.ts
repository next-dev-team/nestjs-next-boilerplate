import { padStart } from 'lodash';
import { Types } from 'mongoose';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// generate accessKey
export const generateAccessKey = async () => {
  return (
    'ack-' +
    Math.random()
      .toString(36)
      .substr(2, 9) +
    '-' +
    new Date().getTime().toString()
  );
};

export const generateAuthKey = async () => {
  return uuidv4() + '-' + new Date().getTime().toString();
};

export const generateInvoiceNumber = (digit: number) => {
  let rndCode = Math.floor(Math.random() * Math.pow(10, digit * 1)) as any;
  rndCode = padStart(rndCode, digit * 1, '0');
  return rndCode;
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  // const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  // console.log('fileExtName:', fileExtName);
  // const randomName = Array(4)
  //   .fill(null)
  //   .map(() => Math.round(Math.random() * 16).toString(16))
  //   .join('');
  callback(null, `${new Date().getTime().toString()}${fileExtName}`);
};

export const getObjectId = (text?: string) => {
  return Types.ObjectId(text);
};

export const getFirstDayOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};
export const getLastDayOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};
export const getFirstDayOfYear = () => {
  const date = new Date();
  return new Date(date.getFullYear(), 0, 1);
};
export const getLastDayOfYear = () => {
  const date = new Date();
  return new Date(date.getFullYear(), 12, 0);
};
