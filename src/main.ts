import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import klBrowserAgent from '@knowlearning/agents';
import settings from './settings.ts'

//  Expose agent for debugging
(<any>window).Agent = klBrowserAgent

console.info(`PILA competence dashboard rev ${__GIT_REVISION__}`);
Agent
  .environment()
  .then(({ variables: { LANGUAGES } }) => {
    settings.LANGUAGES = LANGUAGES;
    createApp(App).mount('#app');
  })
