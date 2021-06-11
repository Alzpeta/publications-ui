<template lang="pug">
q-chip.col-auto(
  v-if="keywords.length"
  v-bind="$attrs"
  color="grey-3"
  v-for="(k, idx) in keywords" :key="idx") {{ k }}
.text-grey-7.text-caption.col-auto.self-center(v-else) {{ $t('message.noKeywords') }}
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'KeywordChips',
  props: {
    keywords: Array,
    default: () => []
  }
})
</script>

<style scoped>

</style>
