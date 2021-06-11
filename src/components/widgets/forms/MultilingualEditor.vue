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
    .row.full-width(v-for="(val, idx) in model" :key="idx")
      .row.col-12.no-wrap.justify-between
        locale-select.col.q-mt-md(
          v-model="model[idx].lang"
          new-value-mode="add-unique"
          :rules="[required($t('error.validation.required'))]"
          @update:model-value="onChange")
        q-btn.q-ma-md.col-auto(round dense flat icon="remove" color="negative"  @click.prevent="rmLang(idx)")
          q-tooltip {{ $t('action.rmLang') }}
      q-editor.col-12.q-mt-md.col-12.no-outline(
        :ref="setInputRef"
        flat
        hide-bottom-space
        v-model="model[idx].val"
        @update:model-value="onChange")
  template(v-slot:append)
    q-btn(v-if="!isEmpty" round dense flat color="positive" icon="add" @click.stop="addLang")
      q-tooltip {{ $t('action.addLang') }}
</template>

<script>
import {computed, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import LocaleSelect from '@/components/widgets/forms/LocaleSelect'
import useValidation from '@/composables/useValidation'
import useModel from '@/composables/useModel'
import useInputRefs from '@/composables/useInputRefs'

export default {
  name: 'MultilingualEditor',
  components: {LocaleSelect},
  emits: ['update:modelValue'],
  props: {
    empty: {
      type: Boolean,
      default: false
    },
    rules: Array,
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup(props, ctx) {
    const i18n = useI18n()
    const {error, required, errorMessage, resetValidation} = useValidation()

    const fieldRef = ref(null)

    const model = ref([])
    const {isEmpty} = useModel(ctx, model)
    const {setInputRef, inputRefs} = useInputRefs()

    if (!Object.keys(props.modelValue).length && !props.empty) {
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
      onChange()
    }

    function addLang() {
      model.value.push(reactive({lang: '', val: ''}))
    }

    function onChange() {
      resetValidation()
      ctx.emit('update:modelValue', modelExternal.value)
    }

    function onFocus() {
      if (isEmpty.value) {
        addLang()
      }
    }

    const modelExternal = computed(() => {
      let values = {}
      model.value.forEach(v => {
        values[v.lang] = v.val !== '<br>'? v.val : ''
      })
      return values
    })

    return {
      model,
      addLang,
      rmLang,
      fieldRef,
      inputRefs,
      setInputRef,
      modelExternal,
      validate,
      error,
      required,
      errorMessage,
      resetValidation,
      onChange,
      onFocus,
      isEmpty
    }
  }
}
</script>

<style scoped>

</style>
