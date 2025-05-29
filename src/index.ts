import { App } from 'vue'
import WindowsPanel from './components/WindowsPanel.vue'

export default {
  install(app: any, options: any) {
    app.component('WindowsPanel', WindowsPanel)
  },
}
