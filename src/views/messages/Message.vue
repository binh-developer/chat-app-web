<template>
  <div
    class="p-1"
    :class="{
      'self-start': sender === false,
      'self-end ': sender === true,
    }"
  >
    <div class="col-start-1 col-end-8 rounded-lg">
      <div class="flex flex-row items-center">
        <div
          v-if="!sender"
          class="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 flex-shrink-0 text-xs text-white"
        >
          {{ name.substring(0, 3) }}
        </div>
        <div
          class="relative ml-2 text-sm bg-white p-2 shadow rounded-t-xl"
          :class="{
            'rounded-r-lg mr-12': sender === false,
            'rounded-l-lg lg:ml-28 ml-16': sender === true,
          }"
        >
          <p class="break-all">{{ textMessage }}</p>
          <img v-if="image !== ''" class="" :src="image" />
          <p class="text-sm text-right text-gray-400">
            {{ format_date(createdAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from "../../util/timeConvert";

export default {
  data() {
    return {};
  },
  props: {
    name: { type: String, default: "" },
    sender: { type: Boolean, default: false },
    createdAt: { type: Number },
    textMessage: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  methods: {
    format_date(value) {
      return formatTime(value);
    },
  },
};
</script>
