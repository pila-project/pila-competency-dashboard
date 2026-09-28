<script setup lang="ts">
import DashBoard from './components/DashBoard.vue';
import type { GameSource } from './GameSource';

// Fetch the user list for the URL
const urlParams = new URLSearchParams(window.location.search);
const users: string[] = [];
const games: GameSource[] = [];
const configurationIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
for (const [key, value] of urlParams) {
  if (key === 'user') {
    users.push(value);
  }
  if (key === 'customized_game' || (key === 'game' && configurationIdPattern.test(value))) {
    games.push({ kind: 'customized-game', configurationId: value });
  } else if (key === 'game') {
    games.push({ kind: 'game', gameId: value });
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
