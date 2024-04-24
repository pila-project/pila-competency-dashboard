<script setup lang="ts">
import DashBoard from './components/DashBoard.vue';

// Fetch the user list for the URL
const urlParams = new URLSearchParams(window.location.search);
const users: string[] = [];
const games: string[] = [];
for (const [key, value] of urlParams) {
  if (key === 'user') {
    users.push(value);
  }
  if (key === 'game') {
    games.push(value);
  }
}
if (games.length === 0) {
  games.push('c8c710aa7fee5af189791f64fc8270d6');
}
</script>

<template>
  <DashBoard :users :games/>
</template>

<style scoped>
</style>
