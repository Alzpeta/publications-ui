<template lang="pug">
base-select.full-width(
  v-bind="$attrs"
  standout
  menu-anchor="bottom left"
  icon="flag"
  v-model="model"
  :options="API_MULTILINGUAL_SUPPORTED_LANGUAGES"
  :label="$t('label.localeSwitcher')"
  :option-label="opt => opt? $t(`value.lang.${opt}`) + ` (${opt})`: `${$t('label.chooseLocale')}…`"
  :hint="$t('hint.localeSwitcher')"
  dense
  options-cover
  emit-value
  stack-label
  map-options
  options-dense
  :rules="rules"
  @update:model-value="$emit('update:modelValue', $event)")
</template>
<script>
import {defineComponent, ref} from 'vue'
import ValidateMixin from '@/mixins/ValidateMixin'
import {API_MULTILINGUAL_SUPPORTED_LANGUAGES} from '@/constants'

export default defineComponent({
  name: 'LocaleSelect',
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props) {
    const model = ref(props.modelValue)
    return {model, API_MULTILINGUAL_SUPPORTED_LANGUAGES}
  }
})
</script>
