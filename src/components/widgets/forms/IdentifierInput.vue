<template lang="pug">
q-field.fit(
  filled
  borderless
  ref="input"
  :error="error"
  stack-label
  :label="label")
  template(v-slot:control)
    .row.no-padding.no-wrap.full-width
      schema-select.col-3(
        ref="scheme"
        :schemes="schemes"
        v-model="model.scheme"
        :rules="[required($t('error.validation.required'))]"
        @update:model-value="onChange")
      base-input.q-ml-sm.col-grow(
        autogrow
        ref="identifier"
        :rules="rules || [required($t('error.validation.required'))]"
        v-bind="$attrs"
        :label="$t('label.identifier')"
        v-model="model.identifier"
        @update:model-value="onChange")
</template>

<script>
import {reactive, ref} from 'vue'
import ValidateMixin from '@/mixins/ValidateMixin'
import useValidation from '@/composables/useValidation'
import useInputRefs from '@/composables/useInputRefs'

export default {
  name: 'IdentifierInput',
  emits: ['update:modelValue'],
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
    modelValue: {
      type: Object,
      default: () => { return {scheme: '', identifier: ''} }
    }
  },
  setup (props, ctx) {
    const {error, required} = useValidation()
    const {input} = useInputRefs()

    const scheme = ref(null)
    const identifier = ref(null)
    const model = reactive(props.modelValue)

    function onChange () {
      ctx.emit('update:modelValue', model)
    }

    function validate () {
      scheme.value.validate()
      identifier.value.validate()

      if (scheme.value.hasError || identifier.value.hasError) {
        error.value = true
      }
      return error.value? 'error.validationFail' : true
    }

    return {input, scheme, identifier, error, model, validate, onChange, required}
  }
}
</script>

<style scoped>

</style>
