<template lang="pug">
q-input(
  ref="input"
  :rules="rules"
  v-bind="$attrs"
  :label="label"
  v-model="modelValue"
  @update:model-value="$emit('update:modelValue', $event)")
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from '@/mixins/ValidateMixin'

export default {
  name: 'BaseInput',
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup () {
    const input = ref(null)
    return {input}
  }
}
</script>

<style scoped>

</style>
