<template lang="pug">
.fit.no-padding.text-center.non-selectable.q-pa-xl.text-grey-7.inset-shadow-all.rounded-borders
  .column.no-padding.justify-center(:style="{ height: `${height}px`}")
    .col-auto.row.justify-center
      slot.col-auto(name="icon")
        q-icon(name="cloud_off" size="xl")
    .col-auto.row.justify-center.q-mt-md
      slot.col-auto
        .text-h6.text-weight-lighter {{ $t(message) }}…
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: 'NoData',
  props: {
    width: Number,
    height: {
      type: Number,
      default: 400
    },
    message: {
      type: String,
      default: 'message.noData'
    }
  }
})
</script>

<style lang="sass" scoped>
.inset-shadow-all
  box-shadow: 1px 1px 30px 9px rgba(0, 0, 0, 0.1) inset !important
</style>
