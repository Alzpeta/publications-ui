<template lang="pug">
base-select(
  ref="input"
  v-bind="$attrs"
  :label="$t('label.authorType')"
  :rules="rules"
  v-model="model"
  :options="Object.values(AUTHOR_TYPES)"
  :option-label="opt => opt? $t(`value.authorType.${opt}`): `${$t('label.chooseAuthorType')}…`"
  @update:model-value="$emit('update:modelValue', $event)")
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from '@/mixins/ValidateMixin'
import {AUTHOR_TYPES} from '@/constants'

export default {
  name: 'AuthorTypeSelect',
  mixins: [ValidateMixin],
  emits: ['update:modelValue'],
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number, Array],
      default: ''
    }
  },
  setup(props) {
    const input = ref(null)
    const model = ref(props.modelValue)

    return {model, input, AUTHOR_TYPES}
  }
}
</script>

<style scoped>

</style>
