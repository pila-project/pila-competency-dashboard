<script setup lang="ts">
// import SuccessBox from './SuccessBox.vue';
import klBrowserAgent from '@knowlearning/agents/browser.js';
import { defined } from '../types';
import { computed, h, reactive } from 'vue';
import { moveElementToFront, zip } from '../array';
import translate from '../translations/translate.ts';
import info from '../assets/info.svg';
import IconButton from './IconButton.vue';

// A game UUID and its resolved name
type GameAndName = { game: string, name: string };
// student UUID is passed as a prop
const props = defineProps<{
  id: string,
  showDetails: boolean,
  gamesAndNames: GameAndName[]
}>();

const emit = defineEmits<{
  (e: 'show-rules', game: string): void;
}>();

// Get the domain name override for accessing user data
const urlParams = new URLSearchParams(window.location.search);
const domainFromUrl = urlParams.get('domain');
const isLocalHost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const domain = domainFromUrl ?? (isLocalHost ? 'localhost:8080' : undefined);
console.debug('Using domain for user data:', domain);

// Setup game state fetching
type ReportData = Record<string, [number, number]>;
const competencyState = reactive(props.gamesAndNames.map(_ => ({} as ReportData)));
props.gamesAndNames.forEach( ({ game }, index) => {
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
const showRuleScoring = translate('Show scoring rules');
const userSkills = computed(() => {
  // Parse data
  type SectionedSkills = Map<string, Set<string>>;
  const skills: SectionedSkills = new Map();
  const zipped = zip(props.gamesAndNames, competencyState);
  type GameData = Map<string, [number, number]>;
  const summaryText = translate('summary');
  const data = zipped.map(([gameAndName, state]) => {
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
      return [gameAndName, data] as [GameAndName, GameData];
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
      return [gameAndName, stats] as [GameAndName, GameData];
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
    ([gameAndName, data]) => h('tr', [
      h('th', h('div', [
        h('span', gameAndName.name),
        h(IconButton, {
          src: info,
          title: showRuleScoring,
          onClick: () => {
            emit('show-rules', gameAndName.game);
          }
        })
      ])),
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
  color: rgb(46, 50, 219);
}
table :deep(tr:nth-child(2)) {
  position: sticky;
  top: 21px; /* this needs to be tuned manually, and for that a specific font must be chosen */
  background-color: white;
  z-index: 2;
  color: #444;
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
  padding-right: 8px;
  background-color: white;
  border-right: 1px solid gray;
}
table :deep(tr:nth-child(n + 3)) > th:first-child > div {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
}

</style>