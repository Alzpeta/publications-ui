<template lang="pug">
//q-skeleton.q-my-md.full-width(v-if="isLoading" animation="pulse" type="box" height="30px")
q-expansion-item.text-black.text-capitalize(
  expand-icon="expand_more"
  expanded-icon="expand_less"
  @show="$emit('open')"
  @hide="$emit('close')")
  template(v-slot:header)
    q-item-section.q-py-xs.facet-name
      .flex-inline.q-gutter-x-md
        span {{ label }}
  template(v-slot="slotData")
    div.bg-grey-4
      slot(v-bind="slotData")
</template>
<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'FacetContainer',
  emits: ['open', 'close'],
  props: {
    label: {
      type: String,
      required: true
    }
  }
})
</script>
