<script setup lang="ts">
import klBrowserAgent from '@knowlearning/agents/browser.js';
import { computedAsync } from '@vueuse/core';
import { defined } from '../types';
import { h } from 'vue'

// student UUID is passed as a prop
const props = defineProps<{ id: string, games: string[] }>();

// Fetch the competency state
type ReportData = Record<string, [number, number]>;
const competencyState = computedAsync(
  async () => {
    if (props.id !== '') {
      return Promise.all(props.games.map(async (game) => {
        const state = await klBrowserAgent.state(`pila/competencies/${game}`, props.id);
        console.debug('Loaded competency state:', props.id, game, state);
        return [game, state] as [string, ReportData];
      }));
    } else {
      console.debug('Empty user id, skipping competency state fetch, using placeholder data.');
      const testState = {
        "math:addition": [1, 1] as [number, number],
        "math:subtraction": [1, 1] as [number, number],
        "math:comparison": [1, 1] as [number, number]
      };
      return props.games.map(game => [game, testState] as [string, ReportData]);
    }
  },
  [] // Initial value
);

// Render function
const userSkills = () => {
  // Parse data
  type SectionedSkills = Map<string, Set<string>>;
  const skills: SectionedSkills = new Map();
  const data = competencyState.value.map(([game, state]) => {
    const data = new Map<string, [number, number]>();
    for (const [key, value] of Object.entries(state)) {
      // Parse key and store skill
      const parts = key.split(':');
      const ns = defined(parts[0]);
      const skill = defined(parts[1]);
      skills.get(ns)?.add(skill) ?? skills.set(ns, new Set([skill]));
      // Process data
      data.set(key, value);
    }
    return [game, data] as [string, Map<string, [number, number]>];
  });

  // Generate HTML table
  const header = h('tr', [
    h('th', 'Game'),
    ...Array.from(skills).map(([ns, skills]) => h('th', { colSpan: skills.size, class: 'skill-section' }, ns))
  ]);
  const subHeader = h('tr', [
    h('th', ''),
    ...Array.from(skills.values()).map(skills => Array.from(skills).map(skill => h('td', { class: 'skill-name' }, skill)))
  ]);
  const content = data.map(
    ([game, data]) => h('tr', [
      h('th', game),
      ...Array.from(skills).flatMap(([ns, skills]) => {
        return Array.from(skills).map(skill => {
          const key = `${ns}:${skill}`;
          const value = data.get(key);
          if (value !== undefined) {
            return h('td', `${value[0]}/${value[1]}`);
          } else {
            return h('td', 'not started');
          }
        })
      })
    ])
  );
  return h('table', [header, subHeader, ...content]);
}
</script>

<template>
  <userSkills />
</template>

<style scoped>
table {
  margin: 0px;
	max-width: 100%;
	max-height: 100%;
	overflow: auto;
	border-spacing: 0px;
  display: block;
  padding-bottom: 16px;
}
table >>> td {
  display: table-cell;
  text-align: center;
  padding-left: 16px;
}
table >>> tr:last-child {
  padding-bottom: 16px;
}
table >>> tr:first-child {
  position: sticky;
  top: 0px;
  background-color: white;
  z-index: 1;
}
table >>> tr:nth-child(2) {
  position: sticky;
  background-color: white;
  z-index: 1;
}
table >>> tr:nth-child(2) > th:first-child {
  z-index: 1;
}
table >>> tr:first-child > th {
  padding-top: 16px;
}
table >>> tr > *:first-child {
  padding-left: 16px;
}
table >>> tr > *:last-child {
  padding-right: 16px; /* 88px for rotated headers */
}
table >>> tr > th:first-child {
  position: sticky;
  left: 0px;
  padding-right: 16px;
  background-color: white;
  border-right: 1px solid gray;
}

</style>