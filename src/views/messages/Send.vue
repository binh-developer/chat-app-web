<template>
  <div
    v-if="this.room !== null"
    class="flex flex-row items-center h-16 w-full px-4"
  >
    <div class="flex-grow ml-4">
      <div class="relative w-full">
        <form v-if="this.user.loggedIn" @submit.prevent="send">
          <input
            type="text"
            placeholder="Aa"
            v-model="toSend.messageText"
            @click="updateUserRead"
            class="w-full p-2 text-sm bg-white appearance-none rounded-lg placeholder-gray-600 focus:bg-white focus:outline-none focus:border-blue-500 focus:text-gray-900 focus:shadow-outline-blue overflow-auto"
            autocomplete="off"
          />

          <div
            class="absolute flex items-center justify-center h-full right-0 top-0 text-gray-400 hover:text-gray-600 pr-2"
          >
            <label
              v-if="this.imageData === null"
              class="flex flex-col items-center bg-white cursor-pointer"
            >
              <i
                class="far fa-file-image my-auto text-blue-500 hover:text-blue-700"
              ></i>
              <input
                class="hidden"
                type="file"
                @change="previewImage"
                accept="image/*"
                ref="inputFile"
              />
            </label>
            <span v-if="this.imageData !== null" class="text-xs">
              {{ this.imageData.name }}
            </span>
          </div>
        </form>
      </div>
    </div>
    <!-- Button Send -->
    <div v-if="this.room !== null" class="ml-4">
      <button
        type="submit"
        @click="send"
        class="flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-3 py-1 flex-shrink-0"
      >
        <span class="">
          <i class="far fa-sm fa-paper-plane"></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { storageOnComplete } from "../../helpers/upload";
import { writeRoomMessages } from "../../helpers/db";
import {
  updateAllUnreadMessages,
  updateUserRead,
} from "../../helpers/room-users";

export default {
  name: "Upload",
  data() {
    return {
      toSend: { messageText: "", imageURL: "" },
      imageData: null,
      picture: null,
      uploadValue: 0,
    };
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
      room: "room",
    }),
  },
  methods: {
    async send() {
      if (this.toSend.messageText !== "") {
        writeRoomMessages(this.room.roomID, this.toSend);
        await updateAllUnreadMessages();
        this.toSend.messageText = "";
        this.toSend.imageURL = "";
      }
      if (this.toSend.messageText === "" && this.imageData !== null) {
        let filename = this.imageData.name.replaceAll(/\s/g, "") + Date.now();
        const storageRef = storageOnComplete(
          `chat-rooms/${this.room.roomID}/${filename}`,
          this.imageData
        );

        storageRef.on(
          `state_changed`,
          (snapshot) => {
            this.uploadValue =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.log(error.message, "Error From Upload");
          },
          () => {
            this.uploadValue = 100;
            storageRef.snapshot.ref.getDownloadURL().then(async (url) => {
              await writeRoomMessages(this.room.roomID, {
                messageText: "",
                imageURL: url,
              });
              this.toSend.messageText = "";
              this.toSend.imageURL = "";
            });
          }
        );

        this.$refs.inputFile = null;
        this.imageData = null;
        this.uploadValue = 0;

        await updateAllUnreadMessages();
      }
    },
    async updateUserRead() {
      await updateUserRead();
    },
    previewImage(event) {
      this.uploadValue = 0;
      this.imageData = event.target.files[0];
    },
  },
};
</script>
