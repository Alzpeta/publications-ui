<template lang="pug">
.column.q-pa-md.q-gutter-sm
  author-input-list.no-padding.col(
    v-model="model.creators"
    ref="creators"
    :label="$t('label.authors')"
    :item-label="$t('label.author')")
  author-input-list.no-padding.col(
    v-model="model.contributors"
    ref="contributors"
    :label="$t('label.contributors')"
    :item-label="$t('label.contributor')")
  stepper-nav(has-prev @next="onNext" @prev="$emit('prev')")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import StepperNav from '@/components/navigation/StepperNav'
import useNotify from '@/composables/useNotify'
import AuthorInputList from '@/components/widgets/forms/AuthorInputList'

export default defineComponent({
  name: 'AuthorsContributors',
  components: {AuthorInputList, StepperNav},
  emits: ['update:modelValue', 'prev', 'next'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const {notifyError} = useNotify()

    const model = reactive(props.modelValue || {creators: [], contributors: []})
    const creators = ref(null)
    const contributors = ref(null)

    watch(model, () => {
      ctx.emit('update:modelValue', model)
    })

    function onNext() {
      const crr = creators.value.validate()
      const cor = contributors.value.validate()

      if (crr !== true) {
        notifyError(crr)
        return
      } else if (cor !== true) {
        notifyError(cor)
        return
      }

      ctx.emit('next')
    }

    return {model, creators, contributors, onNext}
  }
})
</script>
<style lang="sass" scoped>
</style>
