<script setup lang="ts">
import { vueEmbedComponent } from '@knowlearning/agents/vue.js'
import translate from '../translations/translate';
import IconButton from './IconButton.vue';
import arrowBack from '../assets/arrow_back.svg';

defineProps<{ infoId: string, name: string }>();

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
    <div class="dialog-content">
      <vueEmbedComponent
        v-if="infoId"
        :id="infoId"
      />
      <span v-else> --- </span>
    </div>
  </div>
</template>

<style scoped>
.dialog {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
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
.dialog-content {
  flex-grow: 1;
}
</style>
