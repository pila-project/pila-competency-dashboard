<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  iconTrue: string;
  iconFalse: string;
  textTrue?: string;
  textFalse?: string;
}

const props = defineProps<Props>();
const model = defineModel<boolean>();

const toggleValue = () => {
  model.value = !model.value;
};

const currentIcon = computed(() =>
  model.value ? props.iconTrue : props.iconFalse
);

const currentText = computed(() =>
  model.value ? props.textTrue : props.textFalse
);
</script>

<template>
  <div
    class="toggle-wrapper"
    @click="toggleValue"
  >
    <img
      :src="currentIcon"
      class="toggle-icon"
    >
    <span
      v-if="currentText"
      class="toggle-text"
    >{{ currentText }}</span>
  </div>
</template>

<style scoped>
.toggle-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 8px; /* space between icon and text */
  user-select: none;
  padding: 8px;
  border-radius: 32px;
}
.toggle-wrapper:hover {
  background-color: #e7e8ff;
}
.toggle-wrapper:active {
  background-color: #b8b9ff;
}
.toggle-icon {
  width: 24px;
  height: 24px;
  transition: filter 0.2s;
}
.toggle-text {
  color: #444;
}
</style>