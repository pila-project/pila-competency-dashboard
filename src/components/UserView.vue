<script setup lang="ts">
import klBrowserAgent from '@knowlearning/agents';
import { defined } from '../types';
import { computed, h, reactive, watch } from 'vue';
import MarkdownIt from 'markdown-it';
import { moveElementToFront, zip } from '../array';
import translate from '../translations/translate.ts';
import info from '../assets/info.svg';
import IconButton from './IconButton.vue';
import type { GameAndName } from '../GameSource.ts';
import { qualitativePreviewReports } from '../qualitativePreview.ts';

// student UUID is passed as a prop
const props = defineProps<{
  id: string,
  showDetails: boolean,
  gamesAndNames: GameAndName[]
}>();

const emit = defineEmits<{
  (e: 'show-rules', competencyStateId: string): void;
  (e: 'section-titles-visible', visible: boolean): void;
}>();

// Get the domain name override for accessing user data
const urlParams = new URLSearchParams(window.location.search);
const domainFromUrl = urlParams.get('domain');
const isLocalHost = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(location.hostname);
const previewQualitative = isLocalHost && urlParams.get('previewQualitative') === '1';
const domain = domainFromUrl ?? (isLocalHost ? 'localhost:8080' : undefined);
console.debug('Using domain for user data:', domain);

// Setup game state fetching
type CompetencyScore = [number, number];
type ReportData = Record<string, unknown>;
const competencyState = reactive<ReportData[]>([]);
const qualitativeState = reactive<string[]>([]);

// The installed SDK returns an unsubscribe function, but declares a void return type.
const watchState = klBrowserAgent.watch.bind(klBrowserAgent) as (
  ...args: Parameters<typeof klBrowserAgent.watch>
) => () => void;

watch(() => [props.id, props.gamesAndNames] as const, ([userId, games], _, onCleanup) => {
  competencyState.splice(0, competencyState.length, ...games.map(() => ({})));
  qualitativeState.splice(0, qualitativeState.length, ...games.map(() => ''));
  const unsubscribe: (() => void)[] = [];
  onCleanup(() => unsubscribe.forEach(stop => stop()));

  games.forEach(({ competencyStateId }, index) => {
    // Retrofit the old game name pattern for both report types.
    const stateId = competencyStateId.startsWith('incredible_machine')
      ? `candli_editor/${competencyStateId}`
      : competencyStateId;
    unsubscribe.push(watchState(`pila/competencies/${stateId}`, ({ state }) => {
      competencyState[index] = state && typeof state === 'object' ? state as ReportData : {};
    }, userId, domain));
    if (previewQualitative) {
      qualitativeState[index] = qualitativePreviewReports[index] ?? '';
      return;
    }
    unsubscribe.push(watchState(`pila/qualitative_evaluation/${stateId}`, ({ state }) => {
      // Contract: { markdown?: string }; producers overwrite the current evaluation.
      const markdown = (state as ReportData | null)?.markdown;
      qualitativeState[index] = typeof markdown === 'string' ? markdown : '';
    }, userId, domain));
  });
}, { immediate: true });

const markdown = new MarkdownIt({ html: false });
// Keep report headings below the game heading in the document hierarchy.
markdown.core.ruler.push('report-heading-levels', state => {
  for (const token of state.tokens) {
    if (token.type === 'heading_open' || token.type === 'heading_close') {
      token.tag = `h${Math.min(Number(token.tag.slice(1)) + 3, 6)}`;
    }
  }
});
const qualitativeEntries = computed(() => props.gamesAndNames.flatMap((game, index) => {
  const text = qualitativeState[index] ?? '';
  return text.trim() ? [{ ...game, html: markdown.render(text) }] : [];
}));
const hasQuantitativeData = computed(() => competencyState.some(state => competencyEntries(state).length > 0));
const showQuantitative = computed(() => hasQuantitativeData.value || qualitativeEntries.value.length === 0);
const showSectionTitles = computed(() => hasQuantitativeData.value && qualitativeEntries.value.length > 0);
watch(showSectionTitles, visible => emit('section-titles-visible', visible), { immediate: true });

function competencyEntries(state: ReportData): [string, CompetencyScore][] {
  return Object.entries(state).filter((entry): entry is [string, CompetencyScore] => {
    const [key, value] = entry;
    return key !== 'game' &&
      Array.isArray(value) &&
      value.length >= 2 &&
      typeof value[0] === 'number' &&
      typeof value[1] === 'number';
  });
}


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
      for (const [key, value] of competencyEntries(state)) {
        // Parse key and store skill
        const parts = key.split(':');
        const ns = defined(parts[0]);
        const skill = defined(parts[1]);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        skills.get(ns)?.add(skill) ?? skills.set(ns, new Set([skill]));
        // Process data
        data.set(key, value);
      }
      return [gameAndName, data] as [GameAndName, GameData];
    } else {
      const stats: GameData = new Map();
      for (const [key, value] of competencyEntries(state)) {
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
            emit('show-rules', gameAndName.competencyStateId);
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
  <section v-if="showQuantitative">
    <div
      v-if="showSectionTitles"
      class="evaluation-title quantitative-header"
    >
      <h2>
        {{ translate('Quantitative evaluation') }}
      </h2>
      <div class="quantitative-controls">
        <slot name="quantitative-controls" />
      </div>
    </div>
    <userSkills />
    <p class="data-note">
      {{ translate("If the student has played the game multiple times, this dashboard displays their best result. The dashboard updates after they finish playing a game.") }}
    </p>
  </section>
  <section v-if="qualitativeEntries.length">
    <h2
      v-if="showSectionTitles"
      class="evaluation-title"
    >
      {{ translate('Qualitative evaluation') }}
    </h2>
    <article
      v-for="entry in qualitativeEntries"
      :key="entry.competencyStateId"
      class="qualitative-evaluation"
    >
      <h3 class="game-title">
        {{ entry.name }}
      </h3>
      <div class="evaluation-box">
        <span
          v-if="previewQualitative"
          class="preview-notice"
        >
          {{ translate('Sample feedback') }}
        </span>
        <!-- Raw HTML is disabled in the Markdown renderer. -->
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="markdown"
          v-html="entry.html"
        />
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </article>
  </section>
</template>

<style scoped>
.preview-notice {
  position: absolute;
  top: 3px;
  right: 8px;
  color: #666;
  font-size: 0.6875rem;
  line-height: 1;
}

.evaluation-title {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  min-height: 56px;
  margin: 32px 16px 16px;
  padding: 8px 12px;
  background-color: #f0f0f0;
  font-size: 1.5rem;
  line-height: 1.25;
  font-weight: 500;
  color: #333;
  border-radius: 8px;
}
.quantitative-header {
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
}
.quantitative-controls {
  font-size: 1rem;
  font-weight: 400;
}
.quantitative-header h2 {
  margin: 0;
  font: inherit;
}
.game-title {
  margin: 0 0 12px;
  font-size: 1.125rem;
  line-height: 1.35;
  font-weight: 600;
  color: #252b3a;
}
.qualitative-evaluation {
  min-width: 0;
  margin: 0 16px 24px;
}
.evaluation-box {
  position: relative;
  box-sizing: border-box;
  padding: 20px 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.markdown :deep(li + li) {
  margin-top: 8px;
}
@media (max-width: 600px) {
  .evaluation-title {
    font-size: 1.375rem;
  }
  .evaluation-box {
    padding: 16px;
  }
}
.markdown :deep(p),
.markdown :deep(ul),
.markdown :deep(ol),
.markdown :deep(blockquote),
.markdown :deep(pre) {
  margin: 0 0 12px;
}
.markdown :deep(h4),
.markdown :deep(h5),
.markdown :deep(h6) {
  font-size: 0.95rem;
  margin: 16px 0 8px;
}
.markdown :deep(img) {
  max-width: 100%;
  height: auto;
}
.markdown :deep(pre),
.markdown :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
}
.markdown > :deep(:last-child) {
  margin-bottom: 0;
}
.data-note {
  color: #666;
  font-size: 0.82rem;
  line-height: 1.35;
  margin: 4px 16px 16px;
  max-width: 100%;
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
