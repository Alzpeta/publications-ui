<template lang="pug">
term-select(
  v-bind="$attrs"
  v-model="model"
  :label="label"
  taxonomy="licenses"
  multiple
  :elasticsearch="false"
  dense
  :rules="rules"
  @update:model-value="onChange($event)")
</template>
<script>
import {defineComponent, ref} from 'vue'
import ValidateMixin from '@/mixins/ValidateMixin'

export default defineComponent({
  name: 'LanguagesSelect',
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const model = ref(props.modelValue)

    function onChange(event) {
      ctx.emit('update:modelValue', event)
    }

    return {model, onChange}
  }
})
</script>
