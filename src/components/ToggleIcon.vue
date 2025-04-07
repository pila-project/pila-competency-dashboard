<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue: boolean;
  iconTrue: string;
  iconFalse: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'update:modelValue', newValue: boolean): void }>();

const value = ref(false);

const toggleValue = () => {
  value.value = !value.value;
  emit('update:modelValue', value.value);
};
</script>

<template>
  <img
    :src="value ? props.iconTrue : props.iconFalse"
    class="toggle-icon"
    @click="toggleValue"
  >
</template>

<style scoped>
.toggle-icon {
  cursor: pointer;
  width: 24px;
  height: 24px;
}
.toggle-icon:hover {
  background-color: #e8e8ff;
}
.toggle-icon:active {
  background-color: #d0d0ff;
}
</style>