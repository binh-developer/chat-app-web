import store from "../store";
import { db } from "../services/firebase";
import { removeUrlParameter } from "../util/urlProcessing";

const ROOM_MESSAGES_COLLECTIONS = "room-messages";
const ROOM_METADATA_COLLECTIONS = "room-metadata";

/**
 * Read List of messages
 * @returns JSON messages
 */
export function readRoomMessages(roomId) {
  return db()
    .ref(ROOM_MESSAGES_COLLECTIONS + `/${roomId}`)
    .limitToLast(100);
}

/**
 * Write a message
 * @returns
 */
export function writeRoomMessages(roomId, roomData) {
  const user = store.getters.user;
  const { uid, displayName } = user.data;
  let { messageText, imageURL } = roomData;

  if (user.loggedIn !== true) return;
  if (imageURL !== "") {
    imageURL = removeUrlParameter(imageURL, "token");
  }

  return db()
    .ref(ROOM_MESSAGES_COLLECTIONS + `/${roomId}`)
    .push({
      userName: displayName,
      userId: uid,
      messageText,
      imageURL,
      createdAt: db.ServerValue.TIMESTAMP,
    });
}

/**
 *
 * @returns
 */
export function queryRoomMessages() {
  return db().ref(ROOM_METADATA_COLLECTIONS);
}

/**
 * Create a Room
 * @param {string} roomName
 * @param {string} roomType
 * @returns
 */
export function createRoomMetadata(roomName, roomType) {
  const user = store.getters.user;

  return db().ref(ROOM_METADATA_COLLECTIONS).push({
    roomName,
    roomType,
    createdAt: db.ServerValue.TIMESTAMP,
    createdByUserId: user.data.uid,
  });
}

/**
 * Get List of Rooms
 * @returns JSON list of Room
 */
export function getRoomMetadata() {
  return db().ref(ROOM_METADATA_COLLECTIONS);
}

/**
 * Get List of Rooms
 * @returns JSON list of Room
 */
export function getRoomMetadataByKeys(roomId) {
  return db()
    .ref()
    .child(ROOM_METADATA_COLLECTIONS + `/${roomId}`)
    .get();
}

export function deleteRoom(roomId) {
  db()
    .ref(ROOM_METADATA_COLLECTIONS + `/${roomId}`)
    .remove();

  db()
    .ref(ROOM_MESSAGES_COLLECTIONS + `/${roomId}`)
    .remove();
  return;
}
