<template lang="pug">
.column.q-col-gutter-md
  community-select.col(
    ref="primaryCommunity"
    v-if="!communityId"
    filled
    v-model="basicInfo._primary_community"
    :rules="[required($t('error.validation.required'))]")
  base-input(
    v-else
    readonly
    :label="$t('label.primaryCommunity')"
    ref="primaryCommunity"
    v-model="basicInfo._primary_community"
    input-class="text-h5"
    :rules="[required($t('error.validation.required'))]")
  multilingual-input.col(
    ref="title"
    filled
    v-model="basicInfo.title"
    :rules="[required($t('error.validation.required'))]"
    :label="$t('label.titles')"
    input-class="text-h5")
  multilingual-editor.col(
    ref="abstract"
    filled
    v-model="basicInfo.abstract"
    :rules="[required($t('error.validation.required'))]"
    :label="$t('label.abstract')")
  chips-select.col(
    ref="keywords"
    filled
    v-model="basicInfo.keywords"
    :label="$t('label.forms.keywords')")
  multilingual-editor-list.col(
    ref="additionalTitles"
    empty
    v-model="basicInfo.additional_titles"
    :label="$t('label.forms.additionalTitles')")
  .row.col.justify-start.q-gutter-md
    .col-auto
      licenses-select(
        filled
        ref="rights"
        v-model="basicInfo.rights"
        :label="$t('label.license')")
    .col-auto
      languages-select(
        filled
        ref="languages"
        v-model="basicInfo.languages"
        :label="$t('label.languages')")
  .row.col.q-pt-none.q-my-md.full-width
    base-input.col-grow.q-mr-sm(
      ref="publisher"
      filled
      dense
      v-model="basicInfo.publisher"
      :label="$t('label.publisher')")
    date-input.col-auto(
      ref="publication_date"
      filled
      dense
      v-model="basicInfo.publication_date"
      :hint="$t('hint.publicationDate')"
      :label="$t('label.publicationDate')")
  stepper-nav.q-mt-md(has-prev=false @next="onNext")
</template>
<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import useValidation from '@/composables/useValidation'
import useNotify from '@/composables/useNotify'
import StepperNav from '@/components/navigation/StepperNav'
import LanguagesSelect from '@/components/widgets/forms/LanguagesSelect'
import LicensesSelect from '@/components/widgets/forms/LicensesSelect'
import CommunitySelect from '@/components/widgets/forms/CommunitySelect'
import {useContext} from 'vue-context-composition'
import {community} from '@/contexts/community'
import BaseInput from "@/components/widgets/forms/BaseInput";

export default defineComponent({
  name: 'BasicInfo',
  components: {BaseInput, CommunitySelect, StepperNav, LanguagesSelect, LicensesSelect},
  emits: ['update:modelValue', 'next'],
  props: {
    modelValue: Object
  },
  setup(props, ctx) {
    const {required} = useValidation()
    const {notifyError} = useNotify()
    const {communityId} = useContext(community)
    const primaryCommunity = ref(null)
    const title = ref(null)
    const abstract = ref(null)
    const keywords = ref(null)
    const additionalTitles = ref(null)

    const basicInfo = reactive(props.modelValue || {})

    if (communityId) {
      basicInfo['_primary_community'] = communityId
    }

    watch(basicInfo, () => {
      ctx.emit('update:modelValue', basicInfo)
    })

    const onNext = () => {
      const pcr = primaryCommunity.value.validate()
      const tr = title.value.validate()
      const abr = abstract.value.validate()
      const kr = keywords.value.validate()
      const atr = additionalTitles.value.validate()

      if (pcr !== true ||
          tr !== true ||
          abr !== true ||
          kr !== true ||
          atr !== true) {
        notifyError('error.validationFail')
        return
      } else {
        ctx.emit('next')
      }
    }

    return {basicInfo, required, primaryCommunity, title, abstract, keywords, additionalTitles, onNext, communityId}
  }
})
</script>
<style lang="sass" scoped>
</style>
