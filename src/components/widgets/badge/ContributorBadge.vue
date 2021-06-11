<template lang="pug">
q-chip.text-white(
  color="primary"
  v-bind="$attrs")
  q-avatar(v-if="contributor.person_or_org.identifiers?.length" icon="badge" size="lg")
    q-tooltip
      .text-caption {{ identifiersString }}
  span {{ contributor.person_or_org.name }} {{ affiliationsString? `@ ${affiliationsString}`: '' }}
    q-tooltip(v-if="contributor.role?.length")
      span {{ rolesString }}
</template>

<script>
import {computed, defineComponent} from 'vue'
import {useI18n} from 'vue-i18n'
import {useTranslated} from '@/composables/useTranslated'

export default defineComponent({
  name: "ContributorBadge",
  props: {
    contributor: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {locale} = useI18n()
    const {mt} = useTranslated(locale)

    const identifiersString = computed(() => {
      return props.contributor.person_or_org.identifiers
          .map(i => `${i.scheme.toUpperCase()}:${i.identifier}`).join(', ') || ''
    })

    const rolesString = computed (() => {
      return props.contributor.role.map((r => mt(r.title))).join(', ') || ''
    })

    const affiliationsString = computed (() => {
      return props.contributor.affiliations.map((a => a.name)).join(', ') || ''
    })

    return {mt, identifiersString, rolesString, affiliationsString}
  }
})
</script>

<style scoped>

</style>
