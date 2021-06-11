<template lang="pug">

</template>

<script>
import {computed, defineComponent, onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'

export default defineComponent({
  name: 'MultilingualTextTabs',
  setup () {
    const i18n = useI18n()

    const selectedTab = ref(null)
    const langTexts = computed(() => {
      if (!this.text) {
        return []
      }
      const languages = new Set()
      const text = Array.isArray(this.text) ? this.text : [this.text]
      text.forEach(t => {
        Object.keys(t).forEach(l => {
          languages.add(l)
        })
      })
      let sortedLanguages = Array.from(languages)
      sortedLanguages.sort()
      return sortedLanguages.map(lang => {
        return {
          language: lang,
          texts: text.map(x => x[lang]).filter(x => x)
        }
      })
    })

    onMounted(() => {
      const locale = i18n.locale
      if (this.langTexts.find(x => x.language === locale)) {
        this.selectedTab = locale
      } else if (this.langTexts.find(x => x.language === 'cs')) {
        this.selectedTab = 'cs'
      } else if (this.langTexts.find(x => x.language === 'en')) {
        this.selectedTab = 'en'
      } else if (this.langTexts.length > 0) {
        this.selectedTab = this.langTexts[0].language
      }
    })

    return {selectedTab, langTexts}
  }
})
</script>

<style lang="sass" scoped>
</style>
