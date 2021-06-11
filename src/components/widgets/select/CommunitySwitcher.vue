<template lang="pug">
q-select(
  color="primary"
  filled
  square
  clearable
  bottom-slots
  options-cover
  :hint="$t('action.filterByCommunity')"
  hide-hint
  hide-dropdown-icon
  v-model="model"
  @clear="setCommunity(null)"
  :options="communities"
  option-value="id"
  option-label="title"
  :loading="communitiesLoading")
  template(v-slot:selected)
    .row.full-width.q-my-sm(v-if="model")
      .col-auto.self-start.q-pr-md
        q-avatar(size="50px" color="primary" text-color="white" :icon="model.metadata?.logo")
          .text-bold.text-code {{ model?.title[0] }}
      .column.col-8.justify-between
        .col.community-title.text-h6.text-weight-bold.text-primary.q-pb-md(v-if="model") {{ model.title }}
        .col.text-caption {{ model.metadata?.description }}
    .row.justify-between.items-center(v-else)
      .col-auto.text-primary.text-h7 {{ $t('label.noCommunitySelected') }}
      .col-auto
        q-btn(flat :label="$t('action.choose')")
</template>

<script>
import {defineComponent, onBeforeUnmount, ref, watch} from 'vue'
import {useContext} from 'vue-context-composition'
import {community} from '@/contexts/community'

export default defineComponent({
  name: 'CommunitySwitcher',
  setup () {
    const {communities, communitiesLoading, currentCommunity, setCommunity} = useContext(community)
    const model = ref(null)
    const beingUnmounted = ref(false)

    function updateCommunity () {
      if ((model?.value?.id || null) !== (currentCommunity?.value?.id || null)) {
        setCommunity(model?.value?.id || null)
      }
    }

    onBeforeUnmount(() => {
      beingUnmounted.value = true
    })

    watch(currentCommunity, async () => {
      if (!model.value && currentCommunity.value) {
        model.value = {...currentCommunity.value}
      }
      setTimeout(async () => {
        if (!beingUnmounted.value) {
          await updateCommunity()
        }
      })
    })

    watch(model, async() => {
      setTimeout(async () => {
        if (!beingUnmounted.value) {
          await updateCommunity()
        }
      })
    })

    return {model, communities, communitiesLoading, setCommunity, beingUnmounted}
  }
})
</script>
<style lang="sass">
.community-title
  line-height: unset
</style>
