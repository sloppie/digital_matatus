import { NativeModules } from 'react-native';

/**
 * This function is used to read the contents of a file given its URI. This method
 * comes in handy esp given that some Photos and Videos provided in the `content://` URI format making it
 * hard to access their file location thus calling for a method enabling reading of multiple URI formats.
 * 
 * @param {String} uri the URI of the File whose contents are going to be read
 * @param {(status: String, data: String) => {}} callback callback to be invoked once the
 *      the contents of the File are read.
 */
export const readFileContentFromUri = (uri) => {
  return NativeModules.FileManager.readFileContentFromUri(uri);
}

/**
 * This function is used to access the App's cache directory and fetch the file stored by `RNCamera`.
 * After accessing it, the NativeModule transfers the File to the Phones ``DCIM/DigitalMatatus/${type}``
 * where the new File is stored. This file location is passed to the callback `onFinish` and and thus
 * the file can be accessed by the user and also easier for other applications to access.
 * 
 * @param {String} uri the uri of the file that is going to be accessed to get content type 
 * @param {String} type this is the type of Media that is going to be accessed from the cache
 * @param {(status: String, filePath) => {}} onFinish the callback that will be invoked once the File is read from the given uri
 *      this callback has the absolute filePath of the file whose URI is given.
 *      in the case of an Error:
 *        the callback has `NativeModules.FileManager.WRITE_ERR` passed in as the argument instead
 *        of the FilePath.
 * 
 */
export const copyMediaFile = (uri, type) => {
  NativeModules.FileManager.copyMediaFile(uri, type);
}

/**
 * This function is used to get the MIME-Type of the file given its URI.
 * 
 * @param {String} uri this is a string containing the URI of the File in question. 
 * @param {(mimeType: String) => {}} onFinish this is a callback which will have the ContentType of the file passed to it.
 */
export const getContentType = (uri) => {
  return NativeModules.FileManager.getContentType(uri);
}

// exporting all the constants
const ERR_FINDING_TYPE = NativeModules.FileManager.ERR_FINDING_TYPE;
const IMAGE = NativeModules.FileManager.IMAGE;
const VIDEO = NativeModules.FileManager.VIDEO;
const WRITE_ERR = NativeModules.FileManager.WRITE_ERR;
const WRITE_SUCCESS = NativeModules.FileManager.WRITE_SUCCESS;
const READ_ERR = NativeModules.FileManager.READ_ERR;
const READ_SUCCESS = NativeModules.FileManager.READ_SUCCESS;

export {
  ERR_FINDING_TYPE,
  IMAGE,
  VIDEO,
  WRITE_ERR,
  WRITE_SUCCESS,
  READ_ERR,
  READ_SUCCESS
};
