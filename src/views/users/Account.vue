<template>
  <nav class="flex flex-row mb-2">
    <button
      class="w-2/4 text-gray-600 text-sm p-3 block hover:text-blue-500 focus:outline-none"
      :class="{
        'text-blue-500 border-b-2 font-medium border-blue-500':
          isSignedIn === true,
      }"
      @click="isSignedIn = true"
    >
      Sign in</button
    ><button
      class="w-2/4 text-gray-600 text-sm p-3 block hover:text-blue-500 focus:outline-none"
      :class="{
        'text-blue-500 border-b-2 font-medium border-blue-500':
          isSignedIn === false,
      }"
      @click="isSignedIn = false"
    >
      Register
    </button>
  </nav>
  <form action="#" @submit.prevent="submit" class="space-y-2">
    <div class="rounded-md space-y-3 py-3 px-3">
      <!-- Name -->
      <div class="relative" v-if="!this.isSignedIn">
        <span class="absolute inset-y-0 left-0 flex items-center pl-2"
          ><i class="fas fa-sm fa-user text-gray-500"></i
        ></span>
        <input
          id="name"
          type="name"
          name="name"
          placeholder="Your name"
          value
          required
          autofocus
          v-model="form.name"
          class="appearance-none w-full px-3 py-4 pl-8 border-b border-gray-300 bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        />
      </div>
      <!--Email-->
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-2"
          ><i class="fas fa-sm fa-envelope text-gray-500"></i
        ></span>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          required
          autofocus
          v-model="form.email"
          class="appearance-none w-full px-3 py-4 pl-8 border-b border-gray-300 bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        />
      </div>
      <!-- Password -->
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-2"
          ><i class="fas fa-sm fa-lock text-gray-500"></i
        ></span>
        <input
          id="password"
          type="password"
          name="password"
          required
          placeholder="Password"
          v-model="form.password"
          class="appearance-none w-full px-3 py-4 pl-8 border-b border-gray-300 bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        />
      </div>
      <!-- Error Warning -->
      <div>
        <p
          class="text-left text-sm text-red-500 my-2"
          v-if="this.error !== null"
        >
          {{ error }}
        </p>
      </div>

      <!-- Submit button -->
      <div class="relative">
        <button
          type="submit"
          class="w-full my-3 p-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {{ this.isSignedIn ? "Sign in" : "Create" }}
        </button>
      </div>
    </div>
    <!-- Google Login -->
    <div class="flex mt-7 items-center text-center" v-if="this.isSignedIn">
      <hr class="border-gray-300 border-1 w-full rounded-md" />
      <label class="block font-medium text-sm text-gray-600 w-full">
        Sign in with
      </label>
      <hr class="border-gray-300 border-1 w-full rounded-md" />
    </div>

    <div class="flex justify-center" v-if="this.isSignedIn">
      <button
        type="button"
        class="bg-red-500 border-none m-4 px-6 py-2 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
        @click="signInWithGoogle"
      >
        <i class="fab fa-google-plus-g"></i>
      </button>
    </div>
  </form>
</template>

<script>
import {
  signInWithEmailPassword,
  googleSignInPopup,
  signUpWithEmailPassword,
  signOut,
} from "../../helpers/auth";
import { auth } from "../../services/firebase";

export default {
  data() {
    return {
      isSignedIn: true,
      form: {
        name: "",
        email: "",
        password: "",
      },
      error: null,
      isLoggedIn: this.$store.getters.user.loggedIn,
    };
  },
  async created() {
    await auth().onAuthStateChanged((user) => {
      this.$store.dispatch("fetchUser", user);
      this.isLoggedIn = this.$store.getters.user.loggedIn;
    });
  },
  methods: {
    async submit() {
      // In case user Sign in
      if (this.isSignedIn) {
        const loginRes = await signInWithEmailPassword(
          this.form.email,
          this.form.password
        );

        if (loginRes.errorCode && loginRes.errorMessage) {
          this.error = loginRes.errorMessage;
        } else {
          this.isLoggedIn = true;
          // this.$router.replace({
          //   name: "Home",
          // });
        }
      }
      // In case user register a new account
      else {
        const userRegister = await signUpWithEmailPassword(
          this.form.email,
          this.form.password,
          this.form.name
        );

        if (userRegister.errorCode && userRegister.errorMessage) {
          this.error = userRegister.errorMessage;
        } else {
          signOut();
          this.isSignedIn = true;
          // this.$router.replace({
          //   name: "Home",
          // });
        }
      }
    },
    async signInWithGoogle() {
      const loginGoole = await googleSignInPopup();
      if (loginGoole) this.isLoggedIn = true;
    },
  },
  watch: {
    isSignedIn() {
      this.error = null;
      this.form.name = null;
      this.form.email = null;
      this.form.password = null;
    },
  },
};
</script>
