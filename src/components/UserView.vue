<script setup lang="ts">
// import SuccessBox from './SuccessBox.vue';
import klBrowserAgent from '@knowlearning/agents/browser.js';
import { computedAsync } from '@vueuse/core';
import { defined } from '../types';
import { computed, h, reactive } from 'vue';
import { moveElementToFront, zip } from '../array';
import translate from '../translations/translate.ts';

// student UUID is passed as a prop
const props = defineProps<{ id: string, showDetails: boolean, games: string[] }>();

// Get the domain name override for accessing user data
const urlParams = new URLSearchParams(window.location.search);
const domainFromUrl = urlParams.get('domain');
const isLocalHost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const domain = domainFromUrl ?? (isLocalHost ? 'localhost:8080' : undefined);
console.debug('Using domain for user data:', domain);

// Setup game names fetching
const gameNames = computedAsync(
  async () => {
    return Promise.all(props.games.map(async (game) => {
      let gameName = game;
      try {
        const url = isLocalHost ?
          `https://localhost:8080/api/v0/gameNames/${game}` :
          `https://cand.li/api/v0/gameNames/${game}`;
        gameName = await (await fetch(url)).text();
      } catch (e) {
        console.error('Failed to fetch game name:', e);
      }
      return gameName;
    }));
  },
  props.games
);

// Setup game state fetching
type ReportData = Record<string, [number, number]>;
const competencyState = reactive(props.games.map(_ => ({} as ReportData)));
props.games.forEach( (game, index) => {
  klBrowserAgent.watch(`pila/competencies/${game}`, ({ state }) => {
    console.debug('Received competency state for game (using watch):', props.id, game, state);
    competencyState[index] = state as ReportData;
  }, props.id, domain)
});

/*
// Statistics per category
const categoryStats = computed(() => {
  const stats = new Map<string, [number, number]>();
  for (const state of competencyState) {
    for (const [key, value] of Object.entries(state)) {
      const parts = key.split(':');
      const category = defined(parts[0]);
      if (category === 'general') {
        continue;
      }
      const [completed, total] = value;
      const [prevCompleted, prevTotal] = stats.get(category) ?? [0, 0];
      stats.set(category, [prevCompleted + completed, prevTotal + total]);
    }
  }
  return Array.from(stats).map(([category, [completed, total]]) => {
    if (total !== 0) {
      return [category, completed / total] as [string, number];
    } else {
      return [category, 0] as [string, number];
    }
  });
});
*/

// Render function
const userSkills = computed(() => {
  // Parse data
  type SectionedSkills = Map<string, Set<string>>;
  const skills: SectionedSkills = new Map();
  const zipped = zip(gameNames.value, competencyState);
  type GameData = Map<string, [number, number]>;
  const summaryText = translate('summary');
  const data = zipped.map(([game, state]) => {
    if (props.showDetails) {
      const data: GameData = new Map();
      for (const [key, value] of Object.entries(state)) {
        // Parse key and store skill
        const parts = key.split(':');
        const ns = defined(parts[0]);
        const skill = defined(parts[1]);
        skills.get(ns)?.add(skill) ?? skills.set(ns, new Set([skill]));
        // Process data
        data.set(key, value);
      }
      return [game, data] as [string, GameData];
    } else {
      const stats: GameData = new Map();
      for (const [key, value] of Object.entries(state)) {
        const parts = key.split(':');
        const category = defined(parts[0]);
        const syntSkillName = category === 'general' ? defined(parts[1]) : summaryText;
        const synthKey = `${category}:${syntSkillName}`;
        const [completed, total] = value;
        const [prevCompleted, prevTotal] = stats.get(synthKey) ?? [0, 0];
        stats.set(synthKey, [prevCompleted + completed, prevTotal + total]);
        skills.set(category, new Set([syntSkillName]));
      }
      return [game, stats] as [string, GameData];
    }
  });

  // We want the general category first
  const skillArray = moveElementToFront(Array.from(skills), ([ns, _]) => ns === 'general');

  // Generate HTML table
  const header = h('tr', [
    h('th', translate('Game')),
    ...skillArray.map(([ns, skills]) => h('th', { colSpan: skills.size, class: 'skill-section' }, translate(ns)))
  ]);
  const subHeader = h('tr', [
    h('th', ''),
    ...skillArray.flatMap(([_, skills]) => Array.from(skills).map(skill => h('td', { class: 'skill-name' }, translate(skill))))
  ]);
  const content = data.map(
    ([game, data]) => h('tr', [
      h('th', game),
      ...skillArray.flatMap(([ns, skills]) => {
        return Array.from(skills).map(skill => {
          const key = `${ns}:${skill}`;
          const value = data.get(key);
          if (value !== undefined) {
            if (ns === 'general') {
              return h('td', `${value[0]}`);
            } else {
              return h('td', `${value[0]}/${value[1]}`);
            }
          } else {
            if (ns === 'general') {
              return h('td', translate('not started'));
            } else {
              return h('td', '-');
            }
          }
        })
      })
    ])
  );
  return h('table', [header, subHeader, ...content]);
});
</script>

<template>
  <!--<div class="success-boxes">
    <SuccessBox
      v-for="([category, completion]) in categoryStats"
      :key="category"
      :completion="completion"
    >
      {{ translate(category) }}
    </SuccessBox>
  </div>-->
  <userSkills />
</template>

<style scoped>
.success-boxes {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 8px;
}
table {
  margin: 0px;
  margin-top: 16px;
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
  border-spacing: 0px;
  position: relative;
  display: block;
  padding-bottom: 16px;
}
table :deep(td) {
  display: table-cell;
  text-align: center;
  padding-left: 16px;
}
table :deep(th) {
  padding-left: 16px;
}
table :deep(tr:last-child) {
  padding-bottom: 16px;
}
table :deep(tr:first-child) {
  position: sticky;
  top: 0px;
  background-color: white;
  z-index: 2;
}
table :deep(tr:nth-child(2)) {
  position: sticky;
  top: 23px; /* this needs to be tuned manually, and for that a specific font must be chosen */
  background-color: white;
  z-index: 2;
}
table :deep(tr:nth-child(2)) td {
  padding-bottom: 8px;
}
table :deep(tr:nth-child(2)) > th:first-child {
  z-index: 1;
}
table :deep(tr) > *:last-child {
  padding-right: 16px; /* 88px for rotated headers */
}
table :deep(tr) > th:first-child {
  position: sticky;
  left: 0px;
  padding-right: 16px;
  background-color: white;
  border-right: 1px solid gray;
  text-align: right;
}

</style>