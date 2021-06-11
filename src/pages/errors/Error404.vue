<template lang="pug">
.fullscreen.bg-accent.text-white.text-center.q-pa-md.flex.flex-center
  div
    div(style="font-size: 30vh") 404
    .text-h2(style="opacity:.4") {{ $t('message.notFound') }}…
    go-home-btn
</template>

<script>
import GoHomeBtn from '@/components/widgets/button/GoHomeBtn'
import {defineComponent} from 'vue'
import {useI18n} from 'vue-i18n'
import {useMeta} from "quasar";

export default defineComponent({
  name: 'Error404',
  components: {GoHomeBtn},
  setup () {
    const {t} = useI18n()
    useMeta(() => {
      return {title: t('message.notFound')}
    })
  }
})
</script>
