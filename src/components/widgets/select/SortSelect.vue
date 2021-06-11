<template lang="pug">
.column.q-px-sm.justify-start
  .col-3.self-start.text-caption.text-grey-7 {{ $t('action.sort') }}
  q-select.col-auto(
    dense
    filled
    square
    flat
    stack-label
    label-color="primary"
    :options="orderingOptions"
    emit-value
    map-options
    :option-label="opt => $t(opt.label)"
    v-model="query.sort")
      template(v-slot:prepend)
        q-icon(size="xs" name="sort_by_alpha")
</template>
<script>
import {defineComponent, ref} from 'vue'
import {useQuery} from '@oarepo/vue-query-synchronizer'

export default defineComponent({
  name: 'SortSelect',
  setup () {
    const query = useQuery()

    const orderingOptions = ref(
      [
        {
          label: 'label.sort.alphabetical',
          value: 'alphabetical'
        }
      ]
    )

    return {query, orderingOptions}
  }
})
</script>
