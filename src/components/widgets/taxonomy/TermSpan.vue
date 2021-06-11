<template lang="pug">
span.row
  q-icon(v-if="term.icon" :name="term.icon")
  template(v-else v-for="(t, idx) in termPath")
    .text-primary(v-if="idx>0")
      q-icon(size="sm" name="chevron_left")
    mt.self-center(:text="t.title")
</template>

<script>
import {computed, defineComponent} from 'vue'
import {useI18n} from "vue-i18n";
import {useTranslated} from '@/composables/useTranslated'

export default defineComponent({
  name: 'TermSpan',
  props: {
    code: String,
    term: Object,
    levels: {
      type: Number,
      default: 20
    }
  },
  setup (props) {
    const {locale} = useI18n()
    const {mt} = useTranslated(locale)

    const termPath = computed(() => {
      const terms = []

      const _getParent = (term) => {
        if (term.parent) {
          terms.push(_getParent(term.parent))
        }
        return term
      }

      terms.push(_getParent(props.term))
      return terms
    })

    function termIcon(term) {
      if (term.icon && term.icon.startsWith('img:')) {
        return term.icon
      }
      return undefined
    }

    return {mt, termPath, termIcon}
  }
})
</script>

<style lang="sass" scoped>
</style>
