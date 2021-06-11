<template lang="pug">
q-circular-progress(
  indeterminate
  reverse
  show-value
  :value="value"
  size="175px"
  :thickness="0.6"
  font-size="50px"
  color="primary"
  center-color="grey-9"
  track-color="transparent"
  class="q-ma-md")
  q-icon(color="white" name="pending")
.text-subtitle1 {{ message }}…
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'CircularSpinner',
  props: {
    value: {
      type: Number,
      default: 0
    },
    message: {
      type: String,
      default: 'ww'
    }
  }
})
</script>
<style scoped>

</style>
