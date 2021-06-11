<template lang="pug">
.text-grey-7.highlight(v-html="highlight" v-if="hasHighlight")
span(v-else) {{ text }}
</template>

<script>

import {computed, defineComponent, inject} from 'vue'

export default defineComponent({
  name: 'SearchHighlight',
  props: {
    item: Object,
    text: String
  },
  setup (props) {
    const sanitize = inject('sanitize')

    const highlight = computed(() => {
      return sanitize(Object.values(props.item.highlight || {}).flat().join(' ... '), {
        allowedTags: ['em']
      })
    })

    const hasHighlight = computed(() => {
      return props.item.highlight && Object.keys(props.item.highlight).length
    })

    return {hasHighlight, highlight}
  }
})
</script>

<style lang="sass">
.highlight em
  font-weight: bolder
  color: var(--q-accent-dark) !important
</style>
