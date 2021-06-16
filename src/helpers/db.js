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

export function deleteRoom(roomId) {
  db()
    .ref(ROOM_METADATA_COLLECTIONS + `/${roomId}`)
    .remove();

  db()
    .ref(ROOM_MESSAGES_COLLECTIONS + `/${roomId}`)
    .remove();
  return;
}
