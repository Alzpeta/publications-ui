<template lang="pug">
.column.facets
  .col.collection-facets.full-height
    div.q-mx-sm.q-mt-md
      teleport(to="#facets-drawer" v-if="facetsEnabled")
        facets(
          :definition="facetDefinitions"
          :facetLoader="facetLoader"
          :options="facetOptions"
          @facetSelected="facetSelected")
</template>

<script>
import {defineComponent, ref} from 'vue'
import useFacets from '@/composables/useFacets'
import {useQuery} from "@oarepo/vue-query-synchronizer";
import {useContext} from "vue-context-composition";
import {facets} from "@/contexts/facets";

export default defineComponent({
  name: 'FacetList',
  props: {
    collection: {
      type: Object,
      required: true
    }
  },
  emits: ['update:activeFacets'],
  setup(props, ctx) {
    const {facetsEnabled} = useContext(facets)
    const {
      defaults,
      definitions,
      facetDefinitions,
      facetLoader,
      transformFacet,
    } = useFacets(props.collection)
    const query = useQuery()

    const facetOptions = ref({
      defaults: defaults,
    })

    function facetSelected(facetSelection) {
      for (const [k, v] of Object.entries(facetSelection)) {
        if (!v.size) {
          query[transformFacet(k)] = null
        } else {
          query[transformFacet(k)] = [...v]
        }
      }
      ctx.emit('update:activeFacets', facetSelection)
    }

    return {definitions, facetOptions, facetSelected, facetLoader, facetDefinitions, facetsEnabled}
  }
})
</script>
<style lang="sass" scoped>
</style>
