<template lang="pug">
q-header.row.z-top.no-wrap.navbar__header
  q-toolbar.q-pl-xl.col-grow.no-padding
    q-btn.on-right(
      flat
      rounded
      dense
      color="white"
      icon="arrow_back"
      @click="$router.back()"
    )
    sidebar-toggle-btn(:toggle="sidebarToggle")
    q-btn(stretch flat :to="{ name: 'homepage' }")
      img.navbar__logo.col-auto(
        src="/logos/datacare_White.svg")
    q-toolbar-title.q-py-md.text-uppercase.text-weight-bold {{ $t('app.productName') }}
    search-input(v-if="route.meta.useFacets").col-grow
    create-record-btn(color="white")
    collection-toggle-btn
  q-toolbar.col-auto
    q-space.q-ml-xl
    account-dropdown(:authenticated="authenticated")
</template>

<script>
import {ARTICLES_COLLECTION_CODE, DATASETS_COLLECTION_CODE} from '@/constants'
import AccountDropdown from '@/components/account/AccountDropdown'
import {computed, defineComponent} from 'vue'
import useAuth from '@/composables/useAuth'
import SearchInput from '@/components/search/SearchInput'
import {useContext} from 'vue-context-composition'
import {useRoute} from 'vue-router'
import CollectionToggleBtn from '@/components/widgets/button/CollectionToggleBtn'
import SidebarToggleBtn from '@/components/widgets/button/SidebarToggleBtn'

export default defineComponent({
  name: 'Navbar',
  components: {
    SidebarToggleBtn,
    CollectionToggleBtn,
    AccountDropdown,
    SearchInput
  },
  setup() {
    const route = useRoute()
    const {authenticated} = useAuth()

    const sidebarToggle = computed(() => {
      if (route.meta.useFacets) {
        const {facets} = require('@/contexts/facets')
        const {toggleFacetsSidebar} = useContext(facets)
        return toggleFacetsSidebar
      } else if (route.meta.useRecordActions) {
        const {record} = require('@/contexts/record')
        const {toggleRecordSidebar} = useContext(record)
        return toggleRecordSidebar
      }
      return null
    })

    return {
      DATASETS_COLLECTION_CODE,
      ARTICLES_COLLECTION_CODE,
      authenticated,
      route,
      sidebarToggle,
    }
  }
})
</script>

<style lang="sass" scoped>
.navbar
  &__header
    background: linear-gradient(145deg, var(--q-primary) 11%, var(--q-secondary) 100%)

  &__logo
    min-height: 50px
    max-height: 50px
</style>
