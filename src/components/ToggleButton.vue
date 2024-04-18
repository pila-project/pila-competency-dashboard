<script setup lang="ts">
defineProps<{ active: boolean }>()
</script>

<template>
  <button
    type="button"
    :class="{ active }"
  >
    <slot />
  </button>
</template>

<style scoped>
button.active {
  background-color: blue;
  color: white;
}
button {
  padding: 8px 16px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:not(.active):hover {
  background-color: #e0e0ff;
}
</style>