<template lang="pug">
q-field.row.fit(
  ref="fieldRef"
  v-bind="$attrs"
  :label="label"
  :error="error"
  :error-message="errorMessage"
  @focus="onFocus"
  borderless)
  template(v-slot:control)
    q-input.col-grow.q-mt-md.no-outline(
      autogrow
      borderless
      v-for="(val, idx) in model" :key="idx"
      v-bind="$attrs"
      :rules="rules"
      v-model="model[idx].val"
      @update:model-value="onChange")
      template(v-slot:prepend)
        locale-select.fit.q-pt-sm(
          hide-bottom-space
          hide-hint
          v-model="model[idx].lang"
          new-value-mode="add-unique"
          @update:model-value="onChange")
      template(v-slot:append)
        q-btn(round dense flat icon="remove" color="negative"  @click="rmLang(idx)")
          q-tooltip {{ $t('action.rmLang') }}
  template(v-slot:append)
    q-btn(round dense flat icon="add" @click="addLang")
      q-tooltip {{ $t('action.addLang') }}
</template>
<script>
import {computed, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import LocaleSelect from '@/components/widgets/forms/LocaleSelect'
import useModel from '@/composables/useModel'
import useValidation from '@/composables/useValidation'

export default {
  name: 'MultilingualInput',
  components: {LocaleSelect},
  emits: ['update:modelValue'],
  props: {
    label: {
      type: String,
      default: ''
    },
    rules: Array,
    modelValue: {
      type: Object,
      default: () => { return {} }
    }
  },
  setup (props, ctx) {
    const i18n = useI18n()
    const {error, errorMessage, resetValidation} = useValidation()

    const fieldRef = ref(null)
    const inputRefs = ref([])

    const model = ref([])
    const {isEmpty} = useModel(ctx, model)

    if (!Object.keys(props.modelValue).length) {
      model.value.push(reactive({lang: i18n.locale.value, val: ''}))
    } else {
      Object.keys(props.modelValue).forEach(l => {
        model.value.push(reactive({lang: l, val: props.modelValue[l]}))
      })
    }

    function validate() {
      resetValidation()
      props.rules.forEach(rule => {
        const res = rule(modelExternal.value)
        if (res !== true) {
          error.value = true
          errorMessage.value = res
        }
      })

      if (error.value !== true) {
        resetValidation()
        return true
      }
      return errorMessage.value
    }

    function rmLang(idx) {
      model.value.splice(idx, 1)
    }

    function addLang() {
      model.value.push(reactive({lang: '', val: ''}))
    }

    const modelExternal = computed(() => {
      let values = {}
      model.value.forEach(v => {
        values[v.lang] = v.val
      })
      return values
    })

    function onChange() {
      resetValidation()
      ctx.emit('update:modelValue', modelExternal.value)
    }

    function onFocus() {
      if (isEmpty.value) {
        addLang()
      }
    }

    return {model, fieldRef, inputRefs, error, errorMessage, validate, onFocus, onChange, addLang, rmLang}
  }
}
</script>

<style scoped>

</style>
