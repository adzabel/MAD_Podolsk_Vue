import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

// Глобальные стили из старого проекта
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/summary.css'
import './styles/work.css'
import './styles/categories.css'
import './styles/mockup.css'
import './styles/modal.css'
import './styles/print.css'
import './styles/tokens.css'
import './styles/utilities.css'

createApp(App)
  .use(router)
  .mount('#app')
