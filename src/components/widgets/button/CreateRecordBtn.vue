<template lang="pug">
q-btn.col-auto(
  v-bind="$attrs"
  stretch
  flat
  color="dark"
  icon="cloud_upload"
  :to="createRoute.to"
  :label="$t('action.upload')")
  q-tooltip {{ $t(createRoute.label) }}
</template>

<script>
import {computed, defineComponent} from 'vue'
import useCollection from '@/composables/useCollection'
import {useContext} from 'vue-context-composition'
import {community} from '@/contexts/community'

export default defineComponent({
  name: 'CreateRecordBtn',
  setup() {
    const {communityId} = useContext(community)
    const {isDatasets, isArticles, model} = useCollection()

    const createRoute = computed(() => {
      let routeName = 'create'
      let label = ''
      let routeParams = {}

      routeParams.model = model.value

      if (communityId.value) {
        routeName = 'community-create'
        routeParams.communityId = communityId.value
      }

      if (isDatasets.value) {
        label = 'action.uploadDataset'
      } else if (isArticles.value) {
        label = 'action.uploadArticle'
      }

      return {
        to: {
          name: routeName,
          params: {...routeParams}
        },
        label: label
      }
    })

    return {createRoute}
  }
})
</script>
