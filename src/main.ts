import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import klBrowserAgent from '@knowlearning/agents';
import settings from './settings.ts'

//  Expose agent for debugging
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).Agent = klBrowserAgent

console.info(`PILA competence dashboard rev ${__GIT_REVISION__}`);
klBrowserAgent.environment().then(({ variables }) => {
  settings.LANGUAGES = variables.LANGUAGES as any;
  createApp(App).mount('#app');
});