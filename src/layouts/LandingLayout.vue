<template lang="pug">
q-layout.bg-grey-1(view="hhh lpR fff")
  landing-header
  q-page-container.no-margin
    router-view
  landing-footer
</template>
<script>
import LandingHeader from '@/components/homepage/LandingHeader'
import LandingFooter from '@/components/homepage/LandingFooter'
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'LandingLayout',
  components: {
    LandingHeader,
    LandingFooter
  }
})
</script>
<style lang="sass">
</style>
