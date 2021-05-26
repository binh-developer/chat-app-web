import { storage } from "../services/firebase";

/**
 * @param {}
 * @param {}
 */
export function storageOnComplete(imageName, imageData) {
  return storage().ref(`${imageName}`).put(imageData);
}
