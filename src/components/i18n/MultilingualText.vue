<template lang="pug">
span
  template(v-for="(a, idx) in shortened ? shortenedText : t")
    slot(name="separator" v-if="idx>0")
      span {{ separator }}
    span {{ a }}
  span.text-primary.q-pl-md.inline-block.cursor-pointer(
    v-if="shortened && shouldBeShortened" @click.stop.prevent="shortened=false") &gt; zobrazit více
  span.text-primary.q-pl-md.inline-block.cursor-pointer(
    v-if="!shortened && shouldBeShortened" @click.stop.prevent="shortened=true") &lt; zobrazit méně
</template>
<script>
import {computed, defineComponent, ref} from 'vue'
import {useTranslated} from '@/composables/useTranslated'
import {useI18n} from 'vue-i18n'

export default defineComponent({
  name: 'mt',
  props: {
    text: {
      type: [Array, Object],
      required: true
    },
    separator: {
      type: String,
      default: ' : '
    },
    shorten: {
      type: Number,
      default: 100000
    }
  },
  setup (props) {
    const {locale} = useI18n()
    const {mt} = useTranslated(locale)
    const shortened = ref(true)

    const t = computed(() => {
      if (!props.text) {
        return []
      }
      if (Array.isArray(props.text)) {
        return props.text.map(x => mt(x))
      }
      return [mt(props.text)]
    })

    const shouldBeShortened = computed(() => {
      if (shortenedText.value.length !== t.value.length) {
        return true
      }
      if (!shortenedText.value.length) {
        return false
      }
      return shortenedText.value[shortenedText.value.length-1] !== t.value[t.value.length-1]
    })

    const shortenedText = computed(() => {
      const ret = []
      let len = 0
      for (const t of t.value) {
        if (len + t.length > props.shorten) {
          ret.push(t.substring(0, props.shorten - len))
          break
        }
        len += t.length
        ret.push(t)
      }
      return ret
    })

    return {shortened, shortenedText, shouldBeShortened}
  }
})
</script>
<style lang="sass">
</style>
