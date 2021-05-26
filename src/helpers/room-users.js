import store from "../store";
import { auth, db } from "../services/firebase";

const ROOM_USERS_COLLECTIONS = "room-users";

export function addUserToRoom() {
  if (store.getters.room === null) return;
  const userInfo = auth().currentUser;
  if (userInfo != null) {
    return db()
      .ref(
        ROOM_USERS_COLLECTIONS +
          "/" +
          store.getters.room.roomID +
          "/" +
          userInfo.uid
      )
      .set({
        readed: true,
      });
  }
}

export async function updateAllUnreadMessages() {
  const userInfo = auth().currentUser;
  const ref = db()
    .ref(ROOM_USERS_COLLECTIONS)
    .child(store.getters.room.roomID)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        for (const [key] of Object.entries(snapshot.val())) {
          if (key !== userInfo.uid) {
            db()
              .ref(ROOM_USERS_COLLECTIONS)
              .child(store.getters.room.roomID)
              .child(key)
              .update({ readed: false });
          }
        }
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return ref;
}

export function updateUserRead() {
  const userInfo = auth().currentUser;

  const ref = db()
    .ref(ROOM_USERS_COLLECTIONS)
    .child(store.getters.room.roomID)
    .child(userInfo.uid)
    .update({ readed: true })
    .catch((error) => {
      console.error(error);
    });

  return ref;
}

export function getUserReadingStatus() {
  const ref = db().ref(ROOM_USERS_COLLECTIONS);
  return ref;
}
