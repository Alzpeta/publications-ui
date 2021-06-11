<template lang="pug">
q-field.fit.row(
  :filled="isEmpty"
  ref="input"
  v-bind="$attrs"
  :label="isEmpty? label: ''"
  :error="error"
  :error_message="errorMessage"
  @focus="onFocus"
  borderless)
  q-list(dense).fit.no-margin.q-pt-md
    q-separator(spaced v-if="model.length > 0")
    q-item.no-padding.no-margin.full-width(v-for="(val,idx) in model" :key="idx")
      q-item-section
        identifier-input(
          :label="`${itemLabel} #${idx + 1}`"
          v-model="model[idx]"
          :schemes="schemes"
          :ref="setInputRef"
          @update:model-value="onChange")
  template(v-if="model.length > 0" v-slot:append)
    list-input-buttons(@add="addItem" @remove="rmItem" can-remove)
  template(v-else v-slot:prepend)
    list-input-buttons(@add="addItem" @remove="rmItem")
</template>

<script>
import {reactive, ref} from 'vue'
import ValidateMixin from '@/mixins/ValidateMixin'
import useInputRefs from '@/composables/useInputRefs'
import useValidation from '@/composables/useValidation'
import ListInputButtons from '@/components/widgets/forms/ListInputButtons'
import useModel from '@/composables/useModel'

export default {
  name: 'IdentifierInputList',
  emits: ['update:modelValue'],
  components: {ListInputButtons},
  mixins: [ValidateMixin],
  props: {
    label: {
      type: String,
      default: ''
    },
    schemes: {
      type: Array,
      default: () => []
    },
    itemLabel: {
      type: String,
      default: '',
    },
    rules: Array,
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const {input, inputRefs, setInputRef} = useInputRefs()
    const {error, errorMessage, resetValidation} = useValidation()

    const model = ref([...props.modelValue] || [])
    const {isEmpty, onChange} = useModel(ctx, model)

    function addItem() {
      model.value.push(reactive({scheme: '', identifier: ''}))
    }

    function rmItem() {
      model.value.splice(model.value.length - 1, 1)
    }

    function onFocus() {
      if (isEmpty.value) {
        addItem()
      }
    }

    function validate() {
      resetValidation()
      inputRefs.value.forEach(inp => {
        const res = inp.validate()
        if (res !== true) {
          error.value = true
        }
      })
      return error.value ? 'error.validationFail' : true
    }

    return {
      input,
      inputRefs,
      setInputRef,
      model,
      error,
      errorMessage,
      addItem,
      rmItem,
      onChange,
      onFocus,
      isEmpty,
      validate
    }
  }
}
</script>

<style scoped>

</style>
