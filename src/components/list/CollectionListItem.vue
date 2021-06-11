<template lang="pug">
q-card(flat clickable)
  q-toolbar.absolute.q-pt-md.q-pb-sm.justify-end
    status-ribbon(v-if="!loading" :metadata="m" dense)
  q-card-section(horizontal)
    q-card-section
      q-skeleton(v-if="loading" :width="`${thumbnailSize}px`" :height="`${thumbnailSize}px`")
    q-card-section(v-if="loading")
      q-skeleton(type="rect" width="400px" height="40px")
      q-skeleton.q-mt-sm(type="text" width="300px")
      q-skeleton.q-mx-md.q-mb-sm.absolute-bottom.q-card__section--vert(type="text" :width="`${thumbnailSize}px`")
    q-card-section(v-else)
      .q-mr-xl.block.text-h5.q-mt-sm.q-mb-xs.gt-xs
        search-highlight(:item="item" :text="mt(m.title)")
      q-separator
      q-card-section
        .row.q-mb-md
          q-chip(v-for="(kw, idx) in m.keywords" :key="idx") {{ kw }}
        .text-subtitle1.ellipsis-3-lines
          span(v-html="$sanitize(mt(m.abstract))")
      q-card-section
        .text-subtitle2.text-grey-8 {{ $t('label.createdAt') }} {{ $d(new Date(dateCreated)) }}
    q-skeleton.absolute-bottom-right.q-px-sm.q-ma-md(
      v-if="loading"
      animation="pulse"
      type="QBtn")
    q-btn.absolute-bottom-right.q-px-sm.q-ma-md(
      v-else
      color="primary"
      rounded
      :label="$t('nav.detail')"
      @click.stop="$emit('detail')")
</template>

<script>
import StatusRibbon from '@/components/widgets/StatusRibbon'
import SearchHighlight from '@/components/search/SearchHighlight'

import {computed, defineComponent} from 'vue'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useTranslated} from '@/composables/useTranslated'

export default defineComponent({
  name: 'CollectionListItem',
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['detail'],
  components: {
    SearchHighlight,
    StatusRibbon
  },
  setup(props) {
    const $q = useQuasar()
    const {locale} = useI18n()
    const {mt} = useTranslated(locale)

    const m = computed(() => {
      return props.item.metadata || {}
    })

    const dateCreated = computed(() => {
      return m.value.dates?.find((dat) => {
        return dat.type === 'created'
      }).date || m.value.created
    })

    const thumbnailSize = computed(() => {
      if ($q.screen.lt.sm) {
        return 100
      } else {
        return 200
      }
    })

    return {m, mt, dateCreated, thumbnailSize}
  }
})
</script>

<style lang="sass">
</style>
