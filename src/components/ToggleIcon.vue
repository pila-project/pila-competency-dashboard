<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  iconTrue: string;
  iconFalse: string;
}

const props = defineProps<Props>();
const model = defineModel<boolean>();

const toggleValue = () => {
  model.value = !model.value;
};

const currentIcon = computed(() =>
  model.value ? props.iconTrue : props.iconFalse
);
</script>

<template>
  <img
    :src="currentIcon"
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