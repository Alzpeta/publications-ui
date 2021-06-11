<template lang="pug">
q-page-sticky(
  position="bottom-right"
  :offset="[18, 18]")
  q-btn(
    fab-mini
    outline
    icon="keyboard_arrow_up"
    color="accent"
    @click="scrollToTop")
    q-tooltip {{ $t('action.scrollToTop') }}
</template>

<script>
import {defineComponent} from 'vue'
import useScroll from '@/composables/useScroll'

export default defineComponent({
  name: 'ScrollTopFab',
  setup () {
    const {isScrolledDown, scrollToTop} = useScroll()
    return {isScrolledDown, scrollToTop}
  }
})
</script>

<style lang="sass" scoped>
</style>
