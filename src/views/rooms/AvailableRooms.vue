<template>
  <div class="flex flex-col mt-2 bg-white h-full overflow-hidden">
    <div class="flex flex-row items-center justify-center text-xs">
      <span class="font-bold p-2">Room Available</span>
      <span
        v-if="listRoom !== null"
        class="flex items-center justify-center text-blue-700 bg-blue-100 p-1 rounded-lg"
        >{{ Object.keys(listRoom).length }}</span
      >
    </div>
    <!-- Search -->
    <div class="relative m-2 flex flex-row">
      <input
        id="search"
        type="search"
        value
        required
        autofocus
        v-model="search"
        @input="searchRoom"
        placeholder="Search..."
        autocomplete="off"
        class="w-full py-2 px-4 text-sm text-gray-900 bg-gray-100 border border-transparent appearance-none rounded-lg focus:bg-white focus:outline-none focus:border-blue-500 focus:text-gray-900 focus:shadow-outline-blue"
      />

      <!-- Create New Room -->
      <router-link to="/create">
        <button
          class="flex items-center justify-center rounded-2xl text-blue-700 bg-blue-100 h-10 w-10 mx-2"
        >
          <i class="fas fa-sm fa-plus"></i>
        </button>
      </router-link>
    </div>

    <!-- List Rooms -->
    <div
      class="flex flex-col items-center p-2 overflow-y-auto overflow-x-hidden bg-gray-50 m-2 rounded-lg"
    >
      <button
        v-for="(value, index) in listRoom"
        v-bind:key="index"
        v-on:click="
          setRoom({
            roomID: index,
            roomName: value.roomName,
            roomOwner: value.createdByUserId,
          });
          addUserToRoom();
          updateUserReaded();
        "
        class="flex flex-row hover:bg-gray-100 p-2 w-full bg-gray-200 m-2 rounded-lg"
      >
        <div class="flex flex-col">
          <div class="flex flex-row space-x-2 px-1">
            <h2
              v-if="this.$store.getters.user.data.uid !== undefined"
              class="text-sm font-semibold text-blue-600"
            >
              Room:
              {{
                value.roomName.charAt(0).toUpperCase() + value.roomName.slice(1)
              }}
            </h2>
            <!-- Unread messages -->
            <div
              v-if="value.readed !== undefined && value.readed !== true"
              class="mt-1 animate-bounce h-3 w-3 inline-flex items-center justify-center rounded-full bg-blue-500 text-indigo-500 flex-shrink-0"
            ></div>
          </div>
          <div class="flex flex-row ml-1">
            <span
              v-if="
                value.lastMessage !== '' &&
                value.lastMessage !== undefined &&
                value.lastMessage !== null
              "
              class="text-xs font-medium text-gray-500 font-bold truncate w-auto"
            >
              {{
                this.$store.getters.user.data.uid === value.lastMessage.userId
                  ? "You: " + value.lastMessage.message
                  : null
              }}
              {{
                this.$store.getters.user.data.uid !== value.lastMessage.userId
                  ? value.lastMessage.userName +
                    ": " +
                    value.lastMessage.message.substring(0, 24)
                  : null
              }}
              <span class="text-red-400">...</span></span
            >
          </div>
          <div class="flex flex-row ml-1">
            <span class="text-xs font-medium text-gray-500">
              {{
                this.$store.getters.user.data.uid == value.createdByUserId
                  ? "Created: " + format_date(value.createdAt)
                  : ""
              }}</span
            >
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { getRoomMetadata, queryRoomMessages } from "../../helpers/db";
import { formatDateWithTime } from "../../util/timeConvert";
import store from "../../store";
import {
  addUserToRoom,
  updateUserRead,
  getUserReadingStatus,
} from "../../helpers/room-users";

export default {
  data() {
    return {
      listRoom: null,
      search: null,
    };
  },
  async mounted() {
    await this.getListRoom();
  },
  methods: {
    setRoom(data) {
      store.dispatch("setRoom", data);
    },
    async searchRoom() {
      if (this.search !== "") {
        await queryRoomMessages()
          .orderByChild("roomName")
          .equalTo(this.search)
          .once("value")
          .then((snapshot) => {
            this.listRoom = snapshot.val();
          });
      }
    },

    async getListRoom() {
      // Get list user
      let uid = this.$store.getters.user.data.uid;
      await getRoomMetadata().on("value", (snapshot) => {
        this.listRoom = snapshot.val();
        console.log(this.listRoom);
      });

      // Compare List Room if user readed message in this room
      await getUserReadingStatus().on("value", (snapshot) => {
        if (snapshot.exists()) {
          if (this.listRoom !== null) {
            for (const [key1] of Object.entries(this.listRoom)) {
              for (const [key2, value2] of Object.entries(snapshot.val())) {
                if (key1 === key2 && Object.keys(value2).includes(uid)) {
                  Object.assign(this.listRoom[key2], value2[uid]);
                }
              }
            }
          }
        }
      });

      store.dispatch("setRoom", null);
    },
    format_date(value) {
      if (value) {
        return formatDateWithTime(value);
      }
    },
    async addUserToRoom() {
      await addUserToRoom();
    },
    async updateUserReaded() {
      await updateUserRead();
    },
  },
  watch: {
    search() {
      if (this.search === "") {
        this.getListRoom();
      }
    },
  },
};
</script>
