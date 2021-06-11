import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {Quasar} from 'quasar'
import quasarUserOptions from './quasar-user-options'
import i18n from '@/boot/i18n'
import addressbarColor from '@/boot/addressbar-color'
import '@/boot/axios'
import VueQuerySynchronizer from "@oarepo/vue-query-synchronizer";
import InvenioApi from '@oarepo/invenio-vue'
import QuasarESFacets from '@oarepo/quasar-es-facets'
import PopupLogin, {usePopupLogin} from '@oarepo/vue-popup-login'
import Vue3Sanitize from 'vue-3-sanitize/dist/vue-3-sanitize'
import components from '@/boot/components'

const app = createApp(App)

// Use extensions & boot files
app
    .use(components)
    .use(Quasar, quasarUserOptions)
    .use(router)
    .use(i18n)
    .use(addressbarColor)
    .use(VueQuerySynchronizer, {
        router,
        debug: false
    })
    .use(InvenioApi)
    .use(QuasarESFacets)
    .use(PopupLogin, {
        router,
        loginUrl: '/oauth/login/eduid/',
        logoutUrl: '/logout',
        logoutMethod: 'POST',
        completeUrl: '/oauth/complete/',
        stateUrl: '/oauth/state/'
    })
    .use(Vue3Sanitize)

app.provide('sanitize', app.config.globalProperties.$sanitize)

const auth = usePopupLogin()

// https://next.router.vuejs.org/guide/migration/#all-navigations-are-now-always-asynchronous
router.isReady()
    .then(() => {
        auth.check().then(() => {
            app.mount('#app')
        })
    })
