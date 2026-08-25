<script setup lang="ts">
import DashBoard from './components/DashBoard.vue';
import type { GameSource } from './GameSource';

// Fetch the user list for the URL
const urlParams = new URLSearchParams(window.location.search);
const users: string[] = [];
const games: GameSource[] = [];
for (const [key, value] of urlParams) {
  if (key === 'user') {
    users.push(value);
  }
  if (key === 'game') {
    games.push({ kind: 'game', gameId: value });
  }
  if (key === 'customized_game') {
    games.push({ kind: 'customized-game', configurationId: value });
  }
}
if (games.length === 0) {
  const gameId = 'c8c710aa7fee5af189791f64fc8270d6';
  games.push({ kind: 'game', gameId });
}
</script>

<template>
  <DashBoard
    :users
    :games
  />
</template>

<style scoped>
</style>
