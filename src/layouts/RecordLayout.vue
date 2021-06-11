<template lang="pug">
q-layout.bg-grey-1(view="hhh lpR lFf")
  navbar
  q-page-container
    router-view
  record-sidebar
</template>

<script>
import Navbar from '@/components/navigation/Navbar'
import {defineComponent} from 'vue'
import RecordSidebar from '@/components/navigation/RecordSidebar'
import {provideContext} from 'vue-context-composition'
import {record} from '@/contexts/record'

export default defineComponent({
  name: 'RecordLayout',
  components: {
    RecordSidebar,
    Navbar
  },
  setup () {
    provideContext(record)
  }
})
</script>
<style lang="sass">
</style>
