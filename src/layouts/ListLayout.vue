<template lang="pug">
q-layout.bg-grey-1(view="hhh lpR lFf")
  navbar
  q-page-container
    router-view
  collection-sidebar
</template>

<script>
import Navbar from '@/components/navigation/Navbar'
import {defineComponent} from 'vue'
import CollectionSidebar from '@/components/navigation/CollectionSidebar'
import {facets} from '@/contexts/facets'
import {provideContext, useContext} from 'vue-context-composition'
import {community} from '@/contexts/community'

export default defineComponent({
  name: 'ListLayout',
  components: {
    CollectionSidebar,
    Navbar
  },
  setup () {
    provideContext(facets)
    const {loadCommunities} = useContext(community)

    loadCommunities()
  }
})
</script>
<style lang="sass">
</style>
