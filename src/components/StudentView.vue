<script setup lang="ts">
import type { BrowserAgentInterface } from '@knowlearning/agents';
import { inject } from 'vue';
import { computedAsync } from '@vueuse/core';

// student UUID is passed as a prop
const props = defineProps<{ id: string }>();
const gameId = 'c8c710aa7fee5af189791f64fc8270d6';

// Fetch the competency state
const klAgent = inject('klAgent') as BrowserAgentInterface;
const competencyState = computedAsync(
  async () => props.id !== '' ? await klAgent.state(`pila/competencies/${gameId}`, props.id) : {},
  {}
);
</script>

<template>
  <div>{{ id }}<br><tt>{{ competencyState }}</tt></div>
</template>