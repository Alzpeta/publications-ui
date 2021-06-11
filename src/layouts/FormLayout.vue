<template lang="pug">
q-layout.bg-grey-1(view="hhh lpR lFf")
  navbar
  q-page-container
    router-view
</template>

<script>
import {defineComponent} from 'vue'
import Navbar from '@/components/navigation/Navbar'

export default defineComponent({
  name: 'FormLayout',
  components: {
    Navbar
  }
})
</script>
<style lang="sass">
</style>
