<template lang="pug">
q-page(padding)
  q-card.bg-grey-3(flat)
    q-card-section
      .text-h5.no-wrap.row.q-gutter-md
        .col-auto
          span.text-accent {{ md.id }}
        q-separator(color="primary" vertical)
        .col-auto
          span {{ mt(md.title) }}
        .col-auto
          status-ribbon(v-if="!record.loading" :metadata="md" dense)
    q-separator
    q-card-section.q-px-lg.bg-grey-4
      .row
        .col-auto.self-center.text-overline.text-uppercase.text-dark.q-mx-md {{ $t('label.authors') }}:
        contributor-badge.col-auto(
          v-if="md.creators"
          v-for="c in md.creators || []" :key="c.person_or_org.name"
          :contributor="c")
        .text-grey-7.text-caption.col-auto.self-center(v-else) {{ $t('message.noAuthors') }}
        .col-auto.self-center.text-overline.text-uppercase.text-dark.q-mx-md {{ $t('label.contributors') }}:
        contributor-badge.col-auto(
          v-if="md.contributors"
          v-for="c in md.contributors || []" :key="c.person_or_org.name"
          :contributor="c")
        .text-grey-7.text-caption.col-auto.self-center(v-else) {{ $t('message.noContributors') }}
        q-space
        .col-auto.self-center.text-overline.text-uppercase.text-dark {{ $t('label.forms.keywords') }}:
        keyword-chips.items-center.q-px-md(:keywords="md.keywords || []")
    q-card-section.q-pa-lg.bg-white
      .text-overline.text-uppercase.text-accent {{ $t('label.abstract') }}
      p(v-html="$sanitize(mt(md.abstract))")
      .text-overline.text-uppercase.text-accent {{ $t('label.identifiers') }}
      .row
        q-chip(v-for="i in md.identifiers" :key="i.identifier" clickable @click="copy2clip(i.identifier)")
          q-avatar.q-mx-md(color="primary" font-size="1rem" size="xl")
            strong.text-caption.text-white.text-bold {{ i.scheme }}
          span {{ i.identifier }}
      .text-overline.text-uppercase.text-accent.q-mt-md {{ $t('label.license') }}
      .row
        q-chip(v-for="r in (md.rights?.length? treeToRoot(md.rights) : [])" :key="r.links.self" )
          term-span(code="licenses" :term="r")
      .text-overline.text-uppercase.text-accent.q-mt-md(v-if="isDatasets") {{ $t('label.files') }}
        dataset-files(:dataset="record")
    metadata-dropdown(:metadata="md")
  record-actions(:record="record")
</template>
<script>
import {computed, defineComponent} from 'vue'
import {useMeta} from 'quasar'
import useCollection from '@/composables/useCollection'
import {useI18n} from 'vue-i18n'
import {useTranslated} from '@/composables/useTranslated'
import RecordActions from '@/components/detail/RecordActions'
import StatusRibbon from '@/components/widgets/StatusRibbon'
import CreatorChips from '@/components/detail/CreatorChips'
import MetadataDropdown from '@/components/detail/MetadataDropdown'
import KeywordChips from '@/components/detail/KeywordChips'
import ContributorBadge from '@/components/widgets/badge/ContributorBadge'
import DatasetFiles from '@/components/detail/DatasetFiles'
import useClipboard from '@/composables/useClipboard'
import TermSpan from '@/components/widgets/taxonomy/TermSpan'
import useTaxonomy from '@/composables/useTaxonomy'

export default defineComponent({
  name: 'RecordDetail',
  components: {
    TermSpan,
    ContributorBadge,
    KeywordChips,
    MetadataDropdown,
    CreatorChips,
    RecordActions,
    StatusRibbon,
    DatasetFiles
  },
  emits: ['reload'],
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {t, locale} = useI18n()
    const {copy2clip} = useClipboard(t)
    const {mt} = useTranslated(locale)
    const {isDatasets, isArticles} = useCollection()
    const {treeToRoot} = useTaxonomy()

    const md = computed(() => {
      return props.record.metadata
    })

    useMeta(() => {
      let titlePath = ''
      if (isDatasets.value) {
        titlePath = 'route.title.datasetItem'
      } else if (isArticles.value) {
        titlePath = 'route.title.articleItem'
      }
      return {title: `${mt(props.record.metadata.title)} - ${t(titlePath)}`}
    })

    return {md, mt, copy2clip, isDatasets, treeToRoot}
  }
})
</script>
<style scoped>
</style>
