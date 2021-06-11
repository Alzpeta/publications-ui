<template lang="pug">
q-card-actions.cursor-pointer(@click="metadataExpanded = !metadataExpanded")
  .text-overline.text-uppercase.text-accent.q-my-md.q-px-lg JSON Metadata
  q-space
  q-btn(
    color="grey"
    round
    flat
    icon="content_copy"
    @click="copy2clip")
  q-btn(
    color="grey"
    round
    flat
    dense
    :icon="metadataExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
    @click="metadataExpanded = !metadataExpanded")
  q-slide-transition.full-width
    .q-pa-md.bg-dark(v-show="metadataExpanded")
      pre.text-code.text-white.wrap.overflow-auto {{ metadata }}
</template>

<script>
import {defineComponent, ref} from 'vue'
import useClipboard from '@/composables/useClipboard'

export default defineComponent({
  name: 'MetadataDropdown',
  props: {
    metadata: Object
  },
  setup () {
    const {copy2clip} = useClipboard()

    const metadataExpanded = ref(false)


    return {metadataExpanded, copy2clip}
  }
})
</script>

<style lang="sass" scoped>
.text-code
  cursor: text
</style>
