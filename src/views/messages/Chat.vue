<template>
  <div class="flex flex-col flex-auto h-full lg:p-4">
    <div class="flex flex-col flex-auto flex-shrink-0 bg-gray-100 h-full">
      <!-- Header Chat -->
      <Header />
      <!-- Main Chat -->
      <div
        v-if="this.room !== null"
        class="flex flex-col h-full overflow-x-auto mb-2 p-2"
      >
        <div class="flex flex-col h-full">
          <Message
            v-for="(items, index) in messages"
            :key="index"
            :name="items.userName"
            :sender="items.userId === user.data.uid"
            :createdAt="items.createdAt"
            :textMessage="items.messageText"
            :image="items.imageURL"
          />
          <div ref="bottom" class="pt-2" />
        </div>
      </div>

      <!-- Send -->
      <Send />
      <!-- List Rooms -->
      <div
        v-if="this.room === null"
        class="2xl:hidden xl:hidden lg:hidden overflow-hidden"
      >
        <AvailableRooms />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { readRoomMessages } from "../../helpers/db";
import AvailableRooms from "../rooms/AvailableRooms";
import Message from "./Message.vue";
import Send from "./Send";
import Header from "./HeaderChat";

export default {
  data() {
    return {
      currentRoom: this.$store.getters.room || "",
      id: null,
      messages: {},
    };
  },
  components: {
    Header,
    Message,
    AvailableRooms,
    Send,
  },
  computed: {
    ...mapGetters({
      room: "room",
      user: "user",
    }),
  },
  methods: {
    read(id) {
      readRoomMessages(id).on("value", (snapshot) => {
        let data = snapshot.val();
        let messages = [];

        if (snapshot.exists()) {
          Object.keys(data).forEach((key) => {
            messages.push({
              messageText: data[key].messageText,
              userName: data[key].userName,
              userId: data[key].userId,
              createdAt: data[key].createdAt,
              imageURL: data[key].imageURL,
            });
            return true;
          });
        }

        if (this.room.roomID === id) this.messages = messages;

        return true;
      });
    },
  },
  watch: {
    messages: function () {
      this.$nextTick(function () {
        this.$refs.bottom?.scrollIntoView({ behavior: "smooth" });
      });
    },
    room() {
      if (this.room !== null) {
        this.currentRoom = this.room;
        this.read(this.room.roomID);
      } else this.messages = {};
    },
  },
};
</script>
