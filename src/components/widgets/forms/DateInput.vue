<template lang="pug">
q-input(
  ref="input"
  :rules="[edtf0Rule]"
  v-bind="$attrs"
  :label="label"
  :mask="edtf0Mask"
  v-model="modelValue"
  @update:model-value="$emit('update:modelValue', $event)")
  template(v-slot:append)
    q-icon(name="event" class="cursor-pointer")
    q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
      q-date(v-model="modelValue")
        .row.items-center.justify-end
          q-btn(v-close-popup :label="$t('action.close')" color="primary" flat)
</template>

<script>
import {ref} from 'vue'
import ValidateMixin from '@/mixins/ValidateMixin'
import useDate from '@/composables/useDate'

export default {
  name: 'DateInput',
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
    const {edtf0Mask, edtf0Rule} = useDate()

    const input = ref(null)
    return {input, edtf0Mask, edtf0Rule}
  }
}
</script>

<style scoped>

</style>
