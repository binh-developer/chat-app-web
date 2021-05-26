<template>
  <div class="flex h-screen antialiased text-gray-800">
    <div class="flex flex-row h-full w-full overflow-x-hidden">
      <!-- Left -->
      <div
        class="hidden lg:flex flex-col py-6 px-3 w-64 bg-white flex-shrink-0"
      >
        <!-- Logo -->
        <div class="flex flex-row items-center justify-center h-12 w-full">
          <div
            class="flex items-center justify-center rounded-2xl text-blue-700 bg-blue-100 h-10 w-10"
          >
            <i class="far fa-comment-dots"></i>
          </div>
          <div class="ml-2 font-bold text-2xl">MeChat</div>
        </div>
        <!-- Profile -->
        <Profile />
        <!-- Rooms -->
        <AvailableRooms />
      </div>
      <!-- Chat -->
      <Chat />
    </div>
  </div>
</template>

<script>
import AvailableRooms from "../views/rooms/AvailableRooms";
import Profile from "../views/users/Profile";
import Chat from "../views/messages/Chat";

export default {
  components: { AvailableRooms, Profile, Chat },
  data() {
    return {};
  },
};
</script>
