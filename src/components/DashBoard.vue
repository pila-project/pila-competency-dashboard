<script setup lang="ts">
// import ToggleButton from './ToggleButton.vue';
import DropDownList from './DropDownList.vue';
import ToggleIconText from './ToggleIconText.vue';
import UserView from './UserView.vue';
import ScoringRulesDialog from './ScoringRulesDialog.vue';
import { computed, ref } from 'vue';
import { computedAsync } from '@vueuse/core';
import klBrowserAgent from '@knowlearning/agents';
import translate from '../translations/translate.ts'
import { defined } from '../types';
import unfoldLess from '../assets/unfold_less.svg';
import unfoldMore from '../assets/unfold_more.svg';
import GameToInformationMap from '../GameToInformationMap.ts';

// Student UUIDs are passed as props
const props = defineProps<{ users: string[], games: string[] }>();

// Fetch users from the KL API
const users = computedAsync(
  async () => {
    return Promise.all(props.users.map(async (uuid) => {
      const userEnv = await klBrowserAgent.environment(uuid);
      console.debug('Environment for', uuid, userEnv);
      return {
        name: userEnv?.auth?.info?.name ?? `Anonymous_${uuid.slice(0,4)}`,
        id: uuid,
      }
    }));
  },
  []
);
const userNames = computed(() => users.value.map(user => user.name));

// Fetch game names using the Candli API
const isLocalHost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
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
const gameAndNames = computed(() => {
  return props.games.map((game, index) => {
    return {
      game,
      name: gameNames.value[index] ?? game,
    };
  });
});

// Active student index
const activeIndex = ref(0);
// Whether we show details
const showDetails = ref(true);
const rulesShownFor = ref<string | null>(null);

// Derived properties
const activeId = computed(() => users.value[activeIndex.value]?.id);
/*const activeName = computed(() => users.value[activeIndex.value]?.name);

function selectStudent(index: number) {
  activeIndex.value = index;
}*/

function showRulesForGame(game: string) {
  const infoId = GameToInformationMap[game];
  rulesShownFor.value = infoId ?? null;
}

const studentLabel = translate('Student');
</script>

<template>
  <template v-if="rulesShownFor">
    <ScoringRulesDialog
      :info-id="rulesShownFor"
      :name="defined(gameNames[games.indexOf(rulesShownFor)])"
      @close="rulesShownFor = null"
    />
  </template>
  <template v-else>
    <div class="outer">
      <div class="inner">
        <!--<div class="users">
            <ToggleButton
              v-for="(student, index) in users"
              :key="student.id"
              :active="index === activeIndex"
              @click="selectStudent(index)"
            >
              {{ student.name }}
            </ToggleButton>
          </div>
          <h2>{{ activeName }}</h2>-->
        <div class="row">
          <DropDownList
            v-model="activeIndex"
            :options="userNames"
            :label="studentLabel"
          />
          <ToggleIconText
            v-model="showDetails"
            :icon-false="unfoldMore"
            :icon-true="unfoldLess"
            :text-true="translate('Hide details')"
            :text-false="translate('Show details')"
          />
        </div>
        <UserView
          v-if="activeId"
          :id="activeId"
          :key="activeId"
          :show-details
          :games-and-names="gameAndNames"
          @show-rules="showRulesForGame"
        />
      </div>
    </div>
  </template>
</template>

<style scoped>
.outer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.inner {
  display: flex;
  flex-direction: column;
  width: max-content;
  max-width: 100vw;
  max-height: 100vh;
}
/*.users {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
h2 {
  text-align: center;
  margin: 16px 0;
}*/
.row {
  display: flex;
  justify-content: space-between;
  align-items: end;
}
.row > div {
  margin: 16px;
}
</style>
