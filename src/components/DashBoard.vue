<script setup lang="ts">
import type { BrowserAgentInterface } from '@knowlearning/agents';
import ToggleButton from './ToggleButton.vue';
import { computed, inject, ref } from 'vue';
import { computedAsync } from '@vueuse/core';

// Student UUIDs are passed as props
const props = defineProps<{ studentIds: string[] }>();

// Fetch students from the KL API
const klAgent = inject('klAgent') as BrowserAgentInterface;
const students = computedAsync(
  async () => {
    return Promise.all(props.studentIds.map(async (uuid) => {
      const userEnv = await klAgent.environment(uuid);
      return {
        name: userEnv?.auth?.info?.name ?? `Anonymous_${uuid.slice(0,4)}`,
        id: uuid,
      }
    }));
  },
  []
);
// const items = ref([{ name: 'Charles', id: 'oeuou' }, { name: 'Albert', id: 'ttut' }]);

// Active student index
const activeIndex = ref(0);

// Derived properties
const activeId = computed(() => students.value[activeIndex.value]?.id);
const activeName = computed(() => students.value[activeIndex.value]?.name);

function selectStudent(index: number) {
  activeIndex.value = index;
}
</script>

<template>
  <div class="dashboard">
    <div class="students">
      <ToggleButton
        v-for="(student, index) in students"
        :key="student.id"
        :active="index === activeIndex"
        @click="selectStudent(index)"
      >
        {{ student.name }}
      </ToggleButton>
    </div>
    <h2>Competences for {{ activeName }}</h2>
    <div>{{ activeId }}</div>
  </div>
</template>

<style scoped>
div.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
}
div.students {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
h2 {
  margin: 16px 0;
}
</style>
