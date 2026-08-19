import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import klBrowserAgent from '@knowlearning/agents';
import settings from './settings.ts';
import { assertString, assertValidArrayString } from './assert.ts';

//  Expose agent for debugging
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).Agent = klBrowserAgent;

console.info(`PILA competence dashboard rev ${__GIT_REVISION__}`);

klBrowserAgent.environment().then(({ variables: { FORCED_LANGUAGE, LANGUAGES } }) => {
  if (FORCED_LANGUAGE !== undefined) {
    assertString(FORCED_LANGUAGE, 'FORCED_LANGUAGE');
    settings.FORCED_LANGUAGE = FORCED_LANGUAGE;
  }
  if (LANGUAGES !== undefined) {
    assertValidArrayString(LANGUAGES, 'LANGUAGES');
    settings.LANGUAGES = LANGUAGES;
  }
  createApp(App).mount('#app');
});
