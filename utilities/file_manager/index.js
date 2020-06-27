import { NativeModules, NativeEventEmitter } from 'react-native';

/************************************************ CONSTANTS **************************************/

const ERR_FINDING_TYPE = NativeModules.FileManager.ERR_FINDING_TYPE;
const IMAGE = NativeModules.FileManager.IMAGE;
const VIDEO = NativeModules.FileManager.VIDEO;
const AUDIO = NativeModules.FileManager.AUDIO;
const WRITE_ERR = NativeModules.FileManager.WRITE_ERR;
const WRITE_SUCCESS = NativeModules.FileManager.WRITE_SUCCESS;
const READ_ERR = NativeModules.FileManager.READ_ERR;
const READ_SUCCESS = NativeModules.FileManager.READ_SUCCESS;

/************************************************ METHODS ****************************************/

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

/************************************ MEDIA FETCHING SECTION *************************************/

/************************************ UTILITARIAN FUNCTIONS **************************************/

// these methods are used by some (maybe all) the functions below. Thus it is more prudent to create
// a function for them instead of having redundant code.

/**
 * 
 * @param {String} mediaUrl this is the media URL that contains the file information of the filee to
 *                          be fetched in form of a http string:
 *                          e.g: `/cdn/fetch/photo/IMG_23.jpeg`
 * 
 * @returns {{
 *  mediaName: String,
 *  extension: String,
 *  mediaType: ("AUDIO" | "IMAGE" | "VIDEO"),
 *  type: ("photo" | "video" | "audio"),
 *  absoluteUrl: String
 * }} object containing all the values that are of importance from the url passed in as an arg 
 */
export const fetchAttributesFromUrl = (mediaUrl) => {
  console.log(mediaUrl);
  /**
   * These are the only types that can be referenced by the NativeModules APIs
   */
  const convertedTypes = {
    "photo": IMAGE,
    "video": VIDEO,
    "audio": AUDIO
  };

  let splitUrl = mediaUrl.split("/");
  let mediaName = splitUrl.pop(); // the last element is the Media name
  let type = splitUrl.pop(); // get the type from the relative url
  let mediaType = convertedTypes[type];
  let absoluteUrl = `http://192.168.43.98:3000/cdn/fetch/${type}/${mediaName}`;
  let extension;
  let mediaNameWithoutExtension;
  try {
    let splitMediaName = mediaName.split(".");
    extension= splitMediaName.pop(); // the last element houses the extension
    mediaNameWithoutExtension = splitMediaName.pop(); // the first element is the fileName (w/o ext)
  } catch(err) {
    extension = ""
    mediaNameWithoutExtension = "";
  }

  return {
    mediaName,
    extension, // ext of the file
    mediaNameWithoutExtension,
    mediaType,
    type, // media type from url
    absoluteUrl, // http://192.168.43.89:3000/cdn/phot/IMG_2.jpeg
  };
}

/**
 * This uses the inderlying Android API `MimeTypeMap` to get the file mimeType based on the file's
 * extension derived from the `file` uri argument passed to this function.
 * 
 * @param { String } fileUri this is a string containing the `file://` that we will be fetching
 *                            the mime type for.
 * 
 * @returns { String } this is the mime type found with regard to the File extension.
 */
export const getMimeTypeFromExtension = (fileUri) => {
  let extension = fileUri.split("/")
                    .pop() // get the last element (which contains the fileName)
                    .split(".").pop() // split at '.' and pop the last string which is def the file ext

  const mimeType = NativeModules.FileManager.getMimeTypeFromExtension(extension);

  // return the mimeType obtained below
  return mimeType;
}

/************************************** MEDIA FETCH FUNCTIONS ************************************/

/**
 * This is used to fetch images from the underlying DigitalMatatus server. This is
 * done using the underlying `NativeModule.FileManager` to help in the caching of the media
 * for future use.
 *
 * @param { String } mediaUrl this is the URL the media is going to be fetched from.
 * @param {(uri: String) => {}} onFetch this is the callback that will be executed once the image
 *                                      is successfully fetched from either server, or the internal
 *                                      storage.
 * @param {(uris: {}) => {}} onThumbnailFetch this is called once the thumbnails are fetched in case
 *                                            the media was a video url. This parameter is `null` unless
 *                                            it is being called from a video component.
 */
export const fetchMediaFromUrl = async (mediaUrl, onFetch, onThumbnailFetch=null) => {
  // get file details
  let {mediaName, mediaType, absoluteUrl} = fetchAttributesFromUrl(mediaUrl);
  let uri; // variable to store the media's uri

  let eventListener = null; // may not be used if the image is cached
  let thumbnailEventListener = null; // this will only be used if this is a video file

  /**
   * This method is fired once the uri is fetched after creation of a new file to the cache
   * 
   * @param { {uri: String} } e this is the writableMap (mimmicks a JSObject) that is sent over the Bridge 
   */
  const onFileFetch = (e) => {
    let uri = e.uri; // fetch the unique key that helps access the File's URI

    // call the passed in callnack and pass the uri as an argument
    onFetch(uri);

    // since this can only be called in the case that an event Listener was fired and that
    // the event was executed, it is by good practice that we remove the listener
    // by accessing it through the variable that is supposed to access the listener.
    eventListener.remove();
  }

  /**
   * This callback os only called in the event that the file was not availabe and needed to be
   * fetched from the remote url. All the thumbnails created are passed in as an argument to this
   * callback which will then call the `onThumbnailFetch` call back passed in by the component
   * that called upon this API.
   * 
   * @param {{
   *  micro: String,
   *  mini: String,
   *  full: String
   * }} uris this  is an object uri containing all the thumbnails passed created for the video
   */
  const onThumbnailsCreated = (uris) => {
    onThumbnailFetch(uris);

    thumbnailEventListener.remove();
  }

  // check if the media file of mediaName is cached in the App's cache directory
  // if so: just fetch the cached version
  // else: fetch from the remote server and cache it for future putposes
  if(NativeModules.FileManager.isCached(mediaName, mediaType)) {
    // fetch the media from the App's cache directory sinct the image is clearly cached;
    uri = await NativeModules.FileManager.getCachedUri(mediaName, mediaType);

    // pass the uri to the callback for action
    onFetch(uri);

    // call the FileManager.fetchThumbnails if the mediaType == VIDEO
    if(onThumbnailFetch)
      fetchThumbnails(mediaUrl, onThumbnailFetch);
  } else {
    // initiate the thread fetching the Media from the App's externalCacheDir
    NativeModules.FileManager.fetchMediaFromUrl(absoluteUrl, mediaName, mediaType);
    // initiate the EventEmitter
    let eventEmitter = new NativeEventEmitter(NativeModules.FileManager);
    // listen for media fetch completion
    eventListener = eventEmitter.addListener(mediaName, onFileFetch);

    // if mediaType == VIDEO, listen for the thumbnail creation completion
    if(mediaType == VIDEO)
      thumbnailEventListener = eventEmitter.addListener(`${mediaName}_thumbnails`, onThumbnailsCreated);

  }
  
}

/**
 * This is a helper function that makes it easier to pull the relevant thumbnails from cache.
 * 
 * @param {String} mediaUrl this is the url of the file whose thumbnail is to be pulled from cache
 * @param {("micro" | "mini" | "full")} size these determins the uri that will be sent back to the
 *                                            component that requested the thumbnail.
 * @param {(uri:{}) => {}} onFetch this is a callback that has the uris passed to it once the
 *                                      thumbnails are fetched from storage
 */
export const fetchThumbnails = async (mediaUrl, onFetch) => {
  let {mediaNameWithoutExtension} = fetchAttributesFromUrl(mediaUrl);
  let thumbnailFileName = {
    micro: `MICRO_${mediaNameWithoutExtension}.jpeg`,
    mini: `MINI_${mediaNameWithoutExtension}.jpeg`,
    full: `FULL_${mediaNameWithoutExtension}.jpeg`
}
  let thumbnailsFound = await NativeModules.FileManager.getCachedVideoThumbnails(
    thumbnailFileName.micro, // micro thumbnail
    thumbnailFileName.mini, // mini thumbnail name
    thumbnailFileName.full // full thumbnail name
  );

  console.log(thumbnailsFound);

  let uris = {};

  // map all the URIs to the object
  thumbnailsFound.split("&").forEach(uri => {
    const microRegExp = /MICRO/i;
    const miniRegExp = /MINI/i;
    const fullRegExp = /FULL/i;

    if(microRegExp.test(uri))
      uris.micro = uri;
    else if(miniRegExp.test(uri))
      uris.mini = uri;
    else if(fullRegExp.test(uri))
      uris.full = uri;

  });

  console.log(uris);

  // return the URIs
  onFetch(uris);
}

// exporting all the constants required to communicate nack and forth over the bridge
export {
  ERR_FINDING_TYPE,
  IMAGE,
  VIDEO,
  AUDIO,
  WRITE_ERR,
  WRITE_SUCCESS,
  READ_ERR,
  READ_SUCCESS
};
