import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'

const state = {
  topNavState: 'home',
  leftNavState: 'home'
}
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings
  },
  getters,
  state
})

export default store
