<template lang="pug">
q-drawer.bg-grey-3.text-dark.scrolling-drawer(
  v-model="recordSidebarVisible"
  :width="320"
  :breakpoint="700")
  .column.no-wrap.q-gutter-y-md.q-py-xl.q-px-lg.justify-start.full-height
    .col-auto.full-width
      q-item(clickable v-ripple @click="backToCollection")
        q-item-section(avatar)
          q-icon(name="arrow_back")
        q-item-section
          q-item-label.text-uppercase.text-caption {{ $t('label.backToCollection') }}
    .col-auto.full-width
      sidebar-section-header(label="label.actions" icon="published_with_changes")
      .col-auto.full-width.column#record-actions-drawer
</template>

<script>
import {defineComponent} from 'vue'
import {record} from '@/contexts/record'
import {useContext} from 'vue-context-composition'
import SidebarSectionHeader from '@/components/widgets/text/SidebarSectionHeader'
import RecordActions from '@/components/detail/RecordActions'
import useCollection from '@/composables/useCollection'
import {community} from '@/contexts/community'
import {useRouter} from 'vue-router'

export default defineComponent({
  name: "RecordSidebar",
  components: {RecordActions, SidebarSectionHeader},
  setup() {
    const {recordSidebarVisible} = useContext(record)
    const {communityId} = useContext(community)
    const {model} = useCollection()
    const router = useRouter()

    function backToCollection() {
      router.push({name: 'community-list', params: {model: model.value, communityId: communityId.value, state: 'all'}})
    }

    return {recordSidebarVisible, backToCollection}
  }
})
</script>

<style lang="sass" scoped>
</style>
