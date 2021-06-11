<template lang="pug">
q-page.q-mx-lg-xl(padding)
  collection-list-header(:collection="collection")
  .column.q-mt-md.q-gutter-y-md(v-if="collection.records.length")
    collection-list-item.col.cursor-pointer.non-selectable(
      v-for="record in collection.records" :key="record.id"
      :loading="!collection.loaded"
      :item="record"
      @detail="navigateDetail(record)"
      @click.native="navigateDetail(record)")
    .col
      pagination.q-mt-lg(:collection="collection")
  no-data.full-height(v-else)
    .text-h6.text-weight-lighter {{ $t('message.noDatasets') }}…
  scroll-top-fab
  facet-list(
    :collection="collection"
    v-model:activeFacets="activeFacets")
</template>
<script>
import {defineComponent} from 'vue'
import NoData from '@/components/widgets/NoData'
import Pagination from '@/components/navigation/Pagination'
import FacetList from '@/components/search/facets/FacetList'
import CollectionListItem from '@/components/list/CollectionListItem'
import CollectionListHeader from '@/components/list/CollectionListHeader'
import {useRouter} from 'vue-router'
import {useContext} from 'vue-context-composition'
import {facets} from '@/contexts/facets'
import ScrollTopFab from '@/components/widgets/button/ScrollTopFab'
import {useMeta} from 'quasar'
import {useI18n} from 'vue-i18n'
import useCollection from '@/composables/useCollection'

export default defineComponent({
  name: 'CollectionList',
  props: {
    collection: {
      type: Object,
      required: true
    }
  },
  components: {
    CollectionListHeader,
    ScrollTopFab,
    CollectionListItem,
    FacetList,
    NoData,
    Pagination
  },
  setup () {
    const {activeFacets} = useContext(facets)

    const {t} = useI18n()
    const {isDatasets, isArticles} = useCollection()
    const router = useRouter()

    useMeta(() => {
      let titlePath = ''
      if (isDatasets.value) {
        titlePath = 'route.title.datasetList'
      } else if (isArticles.value) {
        titlePath = 'route.title.articleList'
      }
      return {title: t(titlePath)}
    })

    function pathFromUrl(url) {
      return new URL(url).pathname
    }

    function navigateDetail(record) {
      router.push(pathFromUrl(record.links.self))
    }

    return {navigateDetail, activeFacets}
  }
})
</script>
<style lang="sass">
</style>
