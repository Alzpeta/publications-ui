<template lang="pug">
q-chip.col-auto.text-white(
  v-if="creators.length"
  color="primary"
  v-bind="$attrs"
  v-for="c in creators"
  :key="c.person_or_org.name")
  q-avatar(v-if="c.person_or_org.identifiers" icon="badge" size="lg")
    q-tooltip {{ c.person_or_org.identifiers.find(i => {return i.scheme === 'orcid'}).identifier }}
  span {{ c.person_or_org.name }}
    q-tooltip(v-if="c.affiliations || c.role")
      span {{ c.role.map((r => mt(r.title))).join(', ') }} @ {{ c.affiliations.map((a => a.name)).join(', ') }}
  span.on-right.text-overline.text-warning(v-if="c.identifiers") {{ c.identifiers.orcid }}
.text-grey-7.text-caption.col-auto.self-center(v-else) {{ $t('message.noAuthors') }}
</template>

<script>
import {defineComponent} from 'vue'
import {useI18n} from 'vue-i18n'
import {useTranslated} from '@/composables/useTranslated'

export default defineComponent({
  name: 'CreatorChips',
  props: {
    creators: Array,
    default: () => []
  },
  setup () {
    const {locale} = useI18n()
    const {mt} = useTranslated(locale)
    return {mt}
  }
})
</script>

<style scoped>

</style>
