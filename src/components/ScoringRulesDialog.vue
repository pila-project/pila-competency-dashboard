<script setup lang="ts">
import translate from '../translations/translate';
import IconButton from './IconButton.vue';
import arrowBack from '../assets/arrow_back.svg';

defineProps<{ game: string, name: string }>();

defineEmits(['close']);

const backTitle = translate("Back");
</script>

<template>
  <div class="dialog">
    <div class="dialog-title">
      <IconButton
        :title="backTitle"
        :src="arrowBack"
        @click="$emit('close')"
      />
      <span>{{ name }}</span>
    </div>
    <!-- TODO KL: Replace this with the Markdown renderer component-->
    <div>Here will come the rendered Markdown scoring rules for game {{ game }}</div>
  </div>
</template>

<style scoped>
.dialog {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
.dialog-title {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding: 8px;
  gap: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid gray;
}
.dialog-title > span {
  font-weight: bold;
  font-size: 20px;
}
</style>
