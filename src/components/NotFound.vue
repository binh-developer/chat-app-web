<template>
  <div class="flex justify-center h-screen">
    <div class="self-center">
      <h1>
        <span class="text-red-500 mx-2">404</span>That's an error. <br />
        The requested URL was not found on this server.
      </h1>
      <div class="mt-2 flex items-center">
        <button @click="$router.go(-1)">Go back ?</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BadGateway",
  data() {
    return {};
  },
};
</script>
