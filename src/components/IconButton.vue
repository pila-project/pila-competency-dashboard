<script lang="ts" setup>
interface Props {
  src: string;
  title?: string;
}
defineProps<Props>();
</script>

<template>
  <button :title>
    <img :src>
  </button>
</template>

<style scoped>
button {
  all: unset;
  cursor: pointer;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  padding: 4px;
}
button:hover {
  background-color: #e8e8ff;
}
button:active {
  background-color: #d0d0ff;
}
img {
  width: 24px;
  height: 24px;
}
</style>