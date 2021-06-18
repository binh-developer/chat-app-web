<template>
  <div
    class="p-2 z-20 flex flex-grow-0 flex-shrink-0 w-full pr-3 bg-white border-b lg:rounded-t-lg"
  >
    <button
      v-if="this.room !== null && this.room.roomID !== null"
      v-on:click="goBack"
      class="text-lg px-2"
    >
      <i class="fas fa-angle-left"></i>
    </button>
    <div class="flex flex-col justify-center flex-1 overflow-hidden">
      <div
        v-if="this.room !== null"
        class="px-2 overflow-hidden text-base font-medium leading-tight text-gray-600 whitespace-no-wrap"
      >
        {{ this.room.roomName }}
      </div>
      <div
        v-if="this.room === null"
        class="flex flex-row overflow-hidden text-base font-medium leading-tight text-gray-600 whitespace-no-wrap"
      >
        <img
          :src="this.user.data.photoURL"
          alt="Avatar"
          class="w-8 h-8 rounded-full"
        />
        <p class="w-8 h-8 p-2">
          {{ this.user.data.displayName }}
        </p>
      </div>
    </div>

    <button
      type="button"
      v-on:click="deleteRoom"
      v-if="this.room !== null && this.user.data.uid === this.room.roomOwner"
      class="flex flex-col self-center ml-2 text-blue-500 focus:outline-none hover:text-blue-200"
    >
      <div class="flex flex-row">
        <p class="text-xs font-medium">Delete Room</p>
      </div>
    </button>

    <button
      type="button"
      v-on:click="leaveRoom"
      v-if="this.room !== null"
      class="flex flex-col self-center ml-2 text-yellow-500 focus:outline-none hover:text-blue-200"
    >
      <div class="flex flex-row">
        <p class="text-xs font-medium">Leave Room</p>
      </div>
    </button>

    <button
      type="button"
      v-on:click="logout"
      class="text-red-500 border-none cursor-pointer px-3 m-2 hover:text-red-200"
    >
      <div class="flex flex-row">
        <span class="text-xs font-medium">Logout</span>
      </div>
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { deleteRoom, leaveRoom } from "../../helpers/db";
import { signOut } from "../../helpers/auth";
import store from "../../store";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      room: "room",
      user: "user",
    }),
  },
  methods: {
    clearRoom() {
      store.dispatch("setRoom", null);
    },
    async deleteRoom() {
      if (this.room.roomID !== null) {
        await deleteRoom(this.room.roomID);
        this.clearRoom();
      }
    },
    async leaveRoom() {
      if (this.room.roomID !== null) {
        await leaveRoom(this.room.roomID);
        this.clearRoom();
      }
    },
    goBack() {
      this.clearRoom();
    },
    logout() {
      this.clearRoom();
      signOut();
    },
  },
};
</script>
