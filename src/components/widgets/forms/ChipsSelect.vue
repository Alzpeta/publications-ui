<template lang="pug">
base-select.full-width(
  ref="input"
  v-bind="$attrs"
  v-model="model"
  use-input
  use-chips
  multiple
  clearable
  :rules="rules"
  :options="keywordOptions"
  hide-dropdown-icon
  new-value-mode="add-unique"
  @clear="clear"
  @update:model-value="$emit('update:modelValue', $event || [])")
</template>
<script>
import {defineComponent, ref} from 'vue'
import ValidateMixin from '@/mixins/ValidateMixin'

export default defineComponent({
  name: 'ChipsSelect',
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const input = ref(null)
    const model = ref(props.modelValue)
    const keywordOptions = ref([])

    function clear (value) {
      console.log(value)
      model.value = []
    }

    return {model, input, keywordOptions, clear}
  }
})
</script>
