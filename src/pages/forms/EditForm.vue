<template lang="pug">
q-page.q-mt-lg.q-mx-lg-xl.full-height(padding)
  .column.justify-center.items-center
    .col.row.q-pb-md
      .text-h3.gt-md
        span {{ header?.title }}
        q-icon.q-pl-md(color="accent" size="md" :name="header?.icon")
      .text-h4.lt-lg.gt-sm.q-mt-none.q-mb-lg
        span {{ header?.title }}
        q-icon.q-pl-md(color="accent" size="sm" :name="header?.icon")
      .text-h6.lt-md.q-mt-none.q-mb-md
        span {{ header?.title }}
        q-icon.q-pl-md(color="accent" size="xs" :name="header?.icon")
    .q-separator(spaced)
    edit-dataset-form.col.q-pr-md(v-if="record.metadata" :record="record")
</template>
<script>
import {computed, defineComponent, ref} from 'vue'
import EditDatasetForm from '@/components/form/EditDatasetForm'
import useCollection from '@/composables/useCollection'
import {useRoute} from 'vue-router'
import {useInvenioRecord} from '@oarepo/invenio-vue'
import {useMeta} from 'quasar'
import {useI18n} from 'vue-i18n'

export default defineComponent({
  name: 'EditForm',
  components: {EditDatasetForm},
  setup() {
    const {t} = useI18n()
    const {isDatasets, isArticles} = useCollection()
    const route = useRoute()
    const record = ref(null)
    const recordApi = route.path.substring(0, route.path.indexOf('/edit'))

    record.value = useInvenioRecord(recordApi, {loadInitial: true})

    const header = computed(() => {
      if (isDatasets.value) {
        return {
          title: `${t('route.title.datasetEdit')} ${record.value.metadata? record.value.metadata.id : ''}`,
          icon: 'edit'
        }
      } else if (isArticles.value) {
        return {
          title: `${t('route.title.articleEdit')} ${record.value.metadata? record.value.metadata.id : ''}`,
          icon: 'edit'
        }
      }
      return null
    })

    useMeta(() => {
      return {title: header.value? header.value.title : ''}
    })

    return {header, record}
  }
})
</script>
<style lang="sass">
</style>
