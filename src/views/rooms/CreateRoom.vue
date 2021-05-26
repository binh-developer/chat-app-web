<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new room
        </h2>
      </div>

      <form
        action="#"
        @submit.prevent="submit"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
          >
            Room Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Room name"
            value
            required
            autofocus
            v-model="form.roomName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Room type
          </label>

          <label class="inline-flex items-center">
            <input
              type="radio"
              class="form-radio"
              name="accountType"
              value="public"
              v-model="form.roomType"
            />
            <span class="ml-2">Public</span>
          </label>
          <label class="inline-flex items-center ml-6">
            <input
              type="radio"
              class="form-radio"
              name="accountType"
              value="private"
              v-model="form.roomType"
            />
            <span class="ml-2">Private</span>
          </label>
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            @click="createRoomMetadata"
          >
            Create
          </button>
          <button
            v-on:click="goBack"
            class="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { createRoomMetadata } from "../../helpers/db";
export default {
  data() {
    return {
      form: {
        roomName: "",
        roomType: "public",
      },
    };
  },
  methods: {
    async createRoomMetadata() {
      if (this.form.roomName.length <= 0) return;

      this.form.roomName = this.form.roomName.replace(/\s/g, "").toLowerCase();

      await createRoomMetadata(this.form.roomName, this.form.roomType);
      this.$router.replace({ name: "Home" });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
