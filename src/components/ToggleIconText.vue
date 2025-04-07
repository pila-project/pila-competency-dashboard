<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  modelValue: boolean;
  iconTrue: string;
  iconFalse: string;
  textTrue?: string;
  textFalse?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'update:modelValue', newValue: boolean): void }>();

const value = ref(false);

const toggleValue = () => {
  value.value = !value.value;
  emit('update:modelValue', value.value);
};

const currentIcon = computed(() =>
  props.modelValue ? props.iconTrue : props.iconFalse
);

const currentText = computed(() =>
  props.modelValue ? props.textTrue : props.textFalse
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
  background-color: #e8e8ff;
}
.toggle-wrapper:active {
  background-color: #d0d0ff;
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