<template lang="pug">
q-btn(stretch flat :to="target.to" :icon="target.icon")
  q-tooltip {{ $t(target.label) }}
</template>

<script>
import {computed, defineComponent} from 'vue'
import useCollection from '@/composables/useCollection'
import {ARTICLES_COLLECTION_CODE, DATASETS_COLLECTION_CODE} from '@/constants'
import {useContext} from 'vue-context-composition'
import {community} from '@/contexts/community'

export default defineComponent({
  name: 'CollectionToggleBtn',
  setup () {
    const {communityId} = useContext(community)
    const {isDatasets, isArticles} = useCollection()

    const target = computed(() => {
      let routeName = 'list'
      let routeParams = {state: 'all'}
      let icon = ''
      let label = ''

      if (communityId.value) {
        routeName = 'community-list'
        routeParams.communityId = communityId.value
      }

      if (isDatasets.value) {
        routeParams.model = ARTICLES_COLLECTION_CODE
        icon = 'article'
        label = 'action.navigateArticleList'
      } else if (isArticles.value) {
        routeParams.model = DATASETS_COLLECTION_CODE
        icon = 'donut_small'
        label = 'action.navigateDatasetList'
      }

      return {
        to: {name: routeName, params:{...routeParams}},
        icon: icon,
        label: label
      }
    })

    return {target}
  }
})
</script>
