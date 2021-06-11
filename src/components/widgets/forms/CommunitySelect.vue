<template lang="pug">
base-select(
  ref="input"
  v-bind="$attrs"
  :label="$t('label.primaryCommunity')"
  :hint="$t('hint.primaryCommunity')"
  :rules="rules"
  :loading="communitiesLoading"
  v-model="model"
  :options="communities"
  clearable
  option-value="id"
  option-label="title"
  @update:model-value="$emit('update:modelValue', $event?.id || '')")
</template>

<script>
import {onMounted, ref} from 'vue'
import ValidateMixin from '@/mixins/ValidateMixin'
import {AUTHOR_TYPES} from '@/constants'
import {useContext} from 'vue-context-composition'
import {community} from '@/contexts/community'

export default {
  name: 'CommunitySelect',
  mixins: [ValidateMixin],
  emits: ['update:modelValue'],
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Object],
      default: ''
    }
  },
  setup(props) {
    const {communities, communitiesLoading, loadCommunities} = useContext(community)

    onMounted(() => {
      loadCommunities()
    })

    const input = ref(null)
    const model = ref(props.modelValue)

    return {model, input, AUTHOR_TYPES, communities, communitiesLoading}
  }
}
</script>

<style scoped>

</style>
