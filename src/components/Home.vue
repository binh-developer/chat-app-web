<template>
  <div
    v-if="!user.loggedIn"
    class="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-6">
      <div>
        <h1 class="text-3xl text-blue-500 font-bold text-center">MeChat</h1>
        <p class="text-center p-2">A new era of messaging</p>
      </div>
      <div
        class="border border-gray-300 bg-gray-50 p-2 px-4 rounded-md shadow-md"
      >
        <div>
          <Account />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="overflow-hidden">
    <Room />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Room from "../components/Room";
import Account from "../views/users/Account";
import { signOut } from "../helpers/auth";

export default {
  components: { Room, Account },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
    }),
  },
  methods: {
    signout() {
      signOut();
    },
  },
};
</script>
