import store from "../store";
import { db, auth } from "../services/firebase";
import { removeUrlParameter } from "../util/urlProcessing";

import { COLLECTIONS } from "../constant";

const {
  ROOM_MESSAGES_COLLECTIONS,
  ROOM_METADATA_COLLECTIONS,
  ROOM_USERS_COLLECTIONS,
  USER_METADATA_COLLECTIONS,
} = COLLECTIONS;

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
export async function writeRoomMessages(roomId, roomData) {
  const user = store.getters.user;
  const timestamp = db.ServerValue.TIMESTAMP;
  const { uid, displayName } = user.data;
  let { messageText, imageURL } = roomData;

  if (user.loggedIn !== true) return;
  if (imageURL !== "") {
    imageURL = removeUrlParameter(imageURL, "token");
  }

  await db()
    .ref(ROOM_METADATA_COLLECTIONS + `/${roomId}`)
    .update({
      lastMessage: {
        createdAt: timestamp,
        message: messageText.length > 0 ? messageText : "image",
        userName: displayName,
        userId: uid,
      },
    });

  return db()
    .ref(ROOM_MESSAGES_COLLECTIONS + `/${roomId}`)
    .push({
      userName: displayName,
      userId: uid,
      messageText,
      imageURL,
      createdAt: timestamp,
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
export function createRoomMetadata(roomName) {
  const user = store.getters.user;
  console.log(user);

  return db().ref(ROOM_METADATA_COLLECTIONS).push({
    roomName,
    createdAt: db.ServerValue.TIMESTAMP,
    createdByUserId: user.data.uid,
    lastMessage: "",
    roomAvatar: "",
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

/**
 * Delete Room
 * @param {string} roomId
 * @param {string} userId
 * @returns
 */
export function deleteRoom(roomId) {
  const userId = auth()?.currentUser?.uid;
  if (userId) {
    db()
      .ref(ROOM_METADATA_COLLECTIONS + `/${roomId}`)
      .remove();

    db()
      .ref(ROOM_MESSAGES_COLLECTIONS + `/${roomId}`)
      .remove();

    db()
      .ref(ROOM_USERS_COLLECTIONS + `/${roomId}`)
      .remove();

    db()
      .ref(USER_METADATA_COLLECTIONS + `/${userId}/rooms/${roomId}`)
      .remove();
  }
  return;
}

export function leaveRoom(roomId) {
  const userId = auth()?.currentUser?.uid;
  if (userId) {
    return db()
      .ref(USER_METADATA_COLLECTIONS + `/${userId}/rooms/${roomId}`)
      .set({
        join: false,
      });
  }
  return;
}
