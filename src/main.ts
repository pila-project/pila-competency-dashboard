import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import klBrowserAgent from '@knowlearning/agents/browser.js';

//  Expose agent for debugging
window.Agent = klBrowserAgent

console.info(`PILA competence dashboard rev ${__GIT_REVISION__}`);
createApp(App).mount('#app');
