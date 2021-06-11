<template lang="pug">
base-select(
  ref="input"
  v-bind="$attrs"
  :label="$t('label.scheme')"
  :rules="rules"
  v-model="model"
  options-dense
  :options="schemes"
  @update:model-value="$emit('update:modelValue', $event)")
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from '@/mixins/ValidateMixin'

export default {
  name: 'SchemaSelect',
  mixins: [ValidateMixin],
  emits: ['update:modelValue'],
  props: {
    label: {
      type: String,
      default: ''
    },
    schemes: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: [String, Number, Array],
      default: ''
    }
  },
  setup(props) {
    const input = ref(null)
    const model = ref(props.modelValue)

    return {model, input}
  }
}
</script>

<style scoped>

</style>
