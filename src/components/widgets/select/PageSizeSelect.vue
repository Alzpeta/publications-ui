<template lang="pug">
.column.q-px-sm.justify-start
  .col-3.self-start.q-pb-sm.text-caption.text-grey-7 {{ $t('label.pageSize') }}
  q-select.col-auto(
  dense
  flat
  filled
  stack-label
  square
  label-color="primary"
  :options="pageSizeOptions"
  v-model="query.size")
</template>
<script>
import {defineComponent, ref} from 'vue'
import {useQuery} from '@oarepo/vue-query-synchronizer'

export default defineComponent({
  name: 'PageSizeSelect',
  setup () {
    const query = useQuery()
    const pageSizeOptions = ref(
      [10, 20, 50, 100, 500]
    )

    return {query, pageSizeOptions}
  }
})
</script>
