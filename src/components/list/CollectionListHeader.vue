<template lang="pug">
.row.justify-between.items-center.q-col-gutter-x-lg.q-mt-md.q-mt-lg-xl.q-mb-md
  .col-auto
    collection-list-title(:collection="collection")
  .col-auto.items-center
    .row.justify-end.no-wrap
      page-size-select.col-auto
      sort-select.col-auto
      create-record-btn.col-auto
</template>
<script>
import {defineComponent} from 'vue'
import SortSelect from '@/components/widgets/select/SortSelect'
import PageSizeSelect from '@/components/widgets/select/PageSizeSelect'
import CollectionListTitle from "@/components/list/CollectionListTitle";

export default defineComponent({
  name: 'CollectionListHeader',
  components: {CollectionListTitle, PageSizeSelect, SortSelect},
  props: {
    collection: {
      type: Object,
      required: true
    }
  }
})
</script>
<style lang="sass">
</style>
