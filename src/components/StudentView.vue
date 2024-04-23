<script setup lang="ts">
import klBrowserAgent from '@knowlearning/agents/browser.js';
import { computedAsync } from '@vueuse/core';

// student UUID is passed as a prop
const props = defineProps<{ id: string }>();
const gameId = 'c8c710aa7fee5af189791f64fc8270d6';

// Fetch the competency state
const competencyState = computedAsync(
  async () => {
    if (props.id !== '') {
      const state = await klBrowserAgent.state(`pila/competencies/${gameId}`, props.id);
      console.debug('Loaded competency state:', props.id, state);
      return state;
    } else {
      console.debug('Empty user id, skipping competency state fetch.');
      return {};
    }
  },
  {}
);
</script>

<template>
  <div>{{ id }}<br><code>{{ competencyState }}</code></div>
</template>