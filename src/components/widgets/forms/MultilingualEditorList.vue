<template lang="pug">
q-field.row(
  :filled="isEmpty"
  v-bind="$attrs"
  :label="label"
  :error="error"
  @focus="onFocus"
  :error_message="errorMessage"
  borderless)
  q-list(dense separator).full-width.no-margin.q-pt-md
    q-separator(spaced v-if="model.length > 0")
    q-item.full-width(v-for="(val,idx) in model" :key="idx")
      q-item-section
        multilingual-editor(
          filled
          :label="`${itemLabel} #${idx + 1}`"
          :rules="rules"
          :ref="setInputRef"
          v-model="model[idx]"
          @update:model-value="onChange")
  template(v-if="!isEmpty" v-slot:append)
    list-input-buttons(@add="addItem" @remove="rmItem" can-remove)
  template(v-else v-slot:prepend)
    list-input-buttons(@add="addItem" @remove="rmItem")
</template>

<script>
import {reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import useValidation from '@/composables/useValidation'
import useInputRefs from '@/composables/useInputRefs'
import ListInputButtons from '@/components/widgets/forms/ListInputButtons'
import useModel from '@/composables/useModel'

export default {
  name: 'MultilingualEditorList',
  components: {ListInputButtons},
  emits: ['update:modelValue'],
  props: {
    empty: {
      type: Boolean,
      default: false
    },
    itemLabel: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: ''
    },
    rules: Array,
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const i18n = useI18n()
    const {setInputRef, inputRefs} = useInputRefs()
    const {error, errorMessage, resetValidation} = useValidation()

    const model = ref([...props.modelValue] || [])
    const {onChange, isEmpty} = useModel(ctx, model)

    if (!Object.keys(props.modelValue).length && !props.empty) {
      let defVal = reactive({})
      defVal[i18n.locale.value] = ''
      model.value.push(defVal)
    } else {
      model.value = reactive([...props.modelValue])
    }

    function validate() {
      // TODO: implement editor validation
      return true
    }

    function addItem() {
      model.value.push(reactive({}))
    }

    function onFocus() {
      if (isEmpty.value) {
        addItem()
      }
    }

    function rmItem() {
      model.value.splice(model.value.length - 1, 1)
    }

    return {
      model,
      inputRefs,
      error,
      errorMessage,
      setInputRef,
      addItem,
      rmItem,
      validate,
      onChange,
      onFocus,
      isEmpty,
      resetValidation
    }
  }
}
</script>

<style scoped>

</style>
