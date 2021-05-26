import { createStore } from "vuex";

export default createStore({
  state: {
    user: {
      loggedIn: false,
      data: null,
    },
    currentRoom: {
      roomID: null,
      roomName: null,
      roomOwner: null,
    },
  },

  getters: {
    user(state) {
      return state.user;
    },
    room(state) {
      return state.currentRoom;
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    },
    SET_CURRENT_ROOM(state, data) {
      state.currentRoom = data;
    },
  },
  actions: {
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);

      if (user) {
        commit("SET_USER", {
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        commit("SET_USER", null);
      }
    },
    setRoom({ commit }, data) {
      console.log(data, "store");
      commit("SET_CURRENT_ROOM", data);
    },
  },
});
