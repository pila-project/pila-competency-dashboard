<script setup lang="ts">
// import ToggleButton from './ToggleButton.vue';
import DropDownList from './DropDownList.vue';
import ToggleIcon from './ToggleIcon.vue';
import { computed, ref } from 'vue';
import { computedAsync } from '@vueuse/core';
import UserView from './UserView.vue';
import klBrowserAgent from '@knowlearning/agents/browser.js';
import translate from '../translations/translate.ts';
import unfoldLess from '../assets/unfold_less.svg';
import unfoldMore from '../assets/unfold_more.svg';

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

// Active student index
const activeIndex = ref(0);

const showDetails = ref(false);

// Derived properties
const activeId = computed(() => users.value[activeIndex.value]?.id);
/*const activeName = computed(() => users.value[activeIndex.value]?.name);

function selectStudent(index: number) {
  activeIndex.value = index;
}*/

const studentLabel = translate('Student');
</script>

<template>
  <div class="dashboard">
    <DropDownList
      v-model="activeIndex"
      :options="userNames"
      :label="studentLabel"
    />
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
    <ToggleIcon
      v-model="showDetails"
      :icon-false="unfoldMore"
      :icon-true="unfoldLess"
    />
    <UserView
      v-if="activeId"
      :id="activeId"
      :key="activeId"
      :showDetails
      :games
    />
  </div>
</template>

<style scoped>
div.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 100vh;
}
div.users {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
h2 {
  text-align: center;
  margin: 16px 0;
}
</style>
