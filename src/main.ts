import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import klBrowserAgent from '@knowlearning/agents';
import settings from './settings.ts';
import { assertValidArrayString } from './assert.ts';

//  Expose agent for debugging
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).Agent = klBrowserAgent;

console.info(`PILA competence dashboard rev ${__GIT_REVISION__}`);

klBrowserAgent.environment().then(({ variables }) => {
  if (variables.LANGUAGES) {
    assertValidArrayString(variables.LANGUAGES, 'LANGUAGES');
    settings.LANGUAGES = variables.LANGUAGES;
  }
  createApp(App).mount('#app');
});