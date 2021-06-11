<template lang="pug">
.row.q-gutter-lg
  .col-grow
    q-table.sticky-name-column(
      flat
      v-if="files.length"
      :rows="files" row-key="file_id" :columns="fileColumns"
      :no-data-label="$t('message.noFiles')")
      template(v-slot:body-cell-download="props")
        q-td(:props="props")
          div
            q-btn(@click="download(props.value)" outline color="primary" :label="$t('label.download')")
  .col-auto.q-mt-md(v-if="canUpload")
    upload-data(:files="dataset.http.data.links.files")
</template>

<script>
import UploadData from '@/components/form/steps/UploadData'
import {computed, defineComponent} from 'vue'
import {useI18n} from 'vue-i18n'
import {format} from 'quasar'
const { humanStorageSize } = format


export default defineComponent({
  name: 'DatasetFiles',
  components: {UploadData},
  props: {
    dataset: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {t} = useI18n()

    const fileColumns = [
      {
        name: 'name',
        required: true,
        label: t('label.name'),
        align: 'left',
        field: row => row.key,
        sortable: true
      },
      {
        name: 'size',
        required: true,
        label: t('label.size'),
        align: 'left',
        field: row => row.size,
        format: val => humanStorageSize(val),
        sortable: true
      },
      {
        name: 'type',
        required: true,
        label: t('label.type'),
        align: 'left',
        field: row => row.mime_type,
        sortable: true
      },
      {
        name: 'download',
        align: 'left',
        field: row => row.url,
        required: true
      }
    ]

    function download(url) {
      window.open(`${url}?download`, '_blank')
    }

    const files = computed(() => {
      return props.dataset.metadata['_files'] || []
    })

    // TODO: add check of auth/state need provides
    const canUpload = computed(() => {
      return props.dataset.metadata['oarepo:draft']
    })

    const uploadUrl = computed(() => {
      return props.dataset.http.data.links.files
    })

    return {download, files, canUpload, uploadUrl, fileColumns}
  }
})
</script>

<style lang="sass">
.sticky-name-column
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  //max-width: 600px

  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #fff

  td:first-child
    background-color: var(--q-grey-2)

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>
