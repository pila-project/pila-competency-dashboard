<script setup lang="ts">
import DashBoard from './components/DashBoard.vue';
import { browserAgent as createKlBrowserAgent } from '@knowlearning/agents';
import { nonnull } from './types';
import { provide } from 'vue';

// Initialize the KL agent
const klBrowserAgent = createKlBrowserAgent();
provide('klAgent', klBrowserAgent);

// Fetch the dashboard config
const urlParams = new URLSearchParams(window.location.search);
const dashboardConfigId = nonnull(urlParams.get('dashboard-config'), 'Dashboard called without a config');
const dashboardConfig = await klBrowserAgent.state(dashboardConfigId);

// Retrieve the student list
const configContent = Object.values(dashboardConfig as object);
const firstEntry = configContent[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const studentIds = Object.keys((firstEntry as any).states as object);
</script>

<template>
  <DashBoard :student-ids />
</template>

<style scoped>
</style>
