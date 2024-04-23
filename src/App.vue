<script setup lang="ts">
import DashBoard from './components/DashBoard.vue';

// Fetch the user list for the URL
const urlParams = new URLSearchParams(window.location.search);
const users: string[] = [];
for (const [key, value] of urlParams) {
  if (key === 'user') {
    users.push(value);
  }
}
</script>

<template>
  <DashBoard :users />
</template>

<style scoped>
</style>
