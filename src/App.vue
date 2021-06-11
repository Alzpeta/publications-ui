<template lang="pug">
router-view(v-slot="{ Component }")
  transition(leave-from-class="fadeOut" enter-from-class="fadeIn")
    component(:is="Component")
</template>

<script>
import {BottomSheet, useMeta, useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {defineComponent} from 'vue'
import {provideContext} from 'vue-context-composition'
import {community} from '@/contexts/community'
import {usePopupLogin} from '@oarepo/vue-popup-login'

export default defineComponent({
  name: 'App',
  setup() {
    provideContext(community)

    const loginApi = usePopupLogin()

    const {t, locale} = useI18n({useScope: 'global'})
    const q = useQuasar()
    locale.value = 'cs'
    try {
      import('quasar/lang/cs')
          .then(lang => {
            q.lang.set(lang.default)
          })
    } catch (err) {
      console.log(err)
    }

    loginApi.registerLoginRequiredHandler(() => {
      return new Promise((resolve) => {
        BottomSheet.create({
          message: 'Authentication required. Click on the button below to log in.',
          actions: [{
            label: 'Log in',
            icon: 'vpn_key',
            id: 'log in'
          }]
        }).onOk(() => {
          resolve(loginApi.login())
        })
      })
    })

    useMeta(() => {
      return {
        title: t('nav.intro') || ' ',
        titleTemplate: title => `${title !== ' ' ? title + ' - ' : ' '}${t('app.productName')}`,
        meta: {
          description: {name: 'description', content: t('app.description')},
        }
      }
    })
  }
})
</script>
