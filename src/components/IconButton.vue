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
  background: rgb(255, 196, 66);
}
button:hover {
  background-color: rgb(255, 215, 127);
}

img {
  width: 24px;
  height: 24px;
}
</style>