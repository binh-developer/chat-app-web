<template>
  <div
    v-if="user.loggedIn"
    class="flex flex-col items-center bg-blue-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg"
  >
    <!-- Avatar -->
    <div class="h-20 w-20 rounded-full border overflow-hidden">
      <img :src="user.data.photoURL" alt="Avatar" class="h-full w-full" />
    </div>
    <div class="text-sm font-semibold mt-2">{{ user.data.displayName }}</div>
    <div class="text-xs text-gray-500">{{ user.data.email }}</div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
    }),
  },
};
</script>
