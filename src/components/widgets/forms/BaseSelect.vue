<template lang="pug">
q-select(
  input-class="col-auto"
  ref="input"
  label-slot
  v-bind="$attrs"
  :label="label"
  :rules="rules"
  v-model="modelValue"
  :options="options"
  @update:model-value="$emit('update:modelValue', $event)")
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from '@/mixins/ValidateMixin'

export default {
  name: 'BaseSelect',
  mixins: [ValidateMixin],
  emits: ['update:modelValue'],
  props: {
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      required: true
    },
    modelValue: {
      type: [String, Number, Array, Object],
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
