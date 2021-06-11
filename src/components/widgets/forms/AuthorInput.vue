<template lang="pug">
q-field.fit(
  filled
  borderless
  ref="input"
  v-bind="$attrs"
  :error="error"
  stack-label
  :label="authorLabel")
  template(v-slot:control)
    .row.full-width.q-mt-md
      author-type-select.col-auto(
        ref="authorType"
        v-model="model.person_or_org.type"
        :rules="[required($t('error.validation.required'))]"
        @update:model-value="onChange")
      base-input.q-ml-sm.col-grow(
        v-if="model.person_or_org.type === AUTHOR_TYPES.PERSON"
        autogrow
        ref="givenName"
        v-model="model.person_or_org.given_name"
        :rules="[required($t('error.validation.required'))]"
        :label="$t('label.givenName')"
        @update:model-value="onChange")
      base-input.q-ml-sm.col-grow(
        v-if="model.person_or_org.type === AUTHOR_TYPES.PERSON"
        autogrow
        ref="familyName"
        v-model="model.person_or_org.family_name"
        :rules="[required($t('error.validation.required'))]"
        :label="$t('label.familyName')"
        @update:model-value="onChange")
      base-input.q-ml-sm.col-grow(
        v-if="model.person_or_org.type === AUTHOR_TYPES.ORGANIZATION"
        autogrow
        ref="name"
        v-model="model.person_or_org.name"
        :rules="[required($t('error.validation.required'))]"
        :label="$t('label.name')"
        @update:model-value="onChange")
    .row.full-width.q-mb-sm
      .col-4.q-mr-sm
        term-select(
          ref="input"
          v-bind="$attrs"
          v-model="model.role"
          taxonomy="contributor-type"
          multiple
          :elasticsearch="false"
          :label="$t('label.authorType')"
          @update:model-value="onChange")
      .col-grow
        chips-select(
          ref="affiliations"
          options-dense
          :label="$t('label.affiliations')"
          v-model="model.affiliations"
          :options="AFFILIATIONS"
          @update:model-value="onChange")
    .row.full-width
      identifier-input-list(
        v-model="model.person_or_org.identifiers"
        ref="identifiers"
        :schemes="PERSON_IDENTIFIER_SCHEMES"
        :label="$t('label.identifiers')"
        :item-label="$t('label.identifier')"
        @update:model-value="onChange")
</template>

<script>
import {computed, reactive, ref} from 'vue'
import ValidateMixin from '@/mixins/ValidateMixin'
import useValidation from '@/composables/useValidation'
import useInputRefs from '@/composables/useInputRefs'
import AuthorTypeSelect from '@/components/widgets/forms/AuthorTypeSelect'
import IdentifierInputList from '@/components/widgets/forms/IdentifierInputList'
import {AFFILIATIONS, AUTHOR_TYPES, PERSON_IDENTIFIER_SCHEMES} from '@/constants'
import TermSelect from '@/components/widgets/forms/TermSelect'

export default {
  name: 'IdentifierInput',
  emits: ['update:modelValue'],
  mixins: [ValidateMixin],
  components: {IdentifierInputList, AuthorTypeSelect, TermSelect},
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Object,
      default: () => {
        return {
          person_or_org: {
            name: '',
            type: 'personal',
            given_name: '',
            family_name: '',
            identifiers: []
          }, role: [], affiliations: []
        }
      }
    }
  },
  setup(props, ctx) {
    const {error, required, resetValidation} = useValidation()
    const {input} = useInputRefs()
    const authorType = ref(null)
    const givenName = ref(null)
    const familyName = ref(null)
    const name = ref(null)
    const identifiers = ref(null)

    const model = reactive(props.modelValue)

    const personName = computed(() => {
      return `${model.person_or_org.family_name}, ${model.person_or_org.given_name}`
    })

    const authorLabel = computed(() => {
      if (model.person_or_org.name === '') {
        return props.label
      } else {
        return `${props.label} - ${model.person_or_org.name}`
      }
    })

    function onChange() {
      if (model.person_or_org.type === AUTHOR_TYPES.PERSON) {
        model.person_or_org.name = personName.value
      }

      // TODO: create affiliations input
      if (model.affiliations) {
        model.affiliations = model.affiliations.map(a => {
          return typeof a === 'string' ? {name: a} : a
        })
      }

      resetValidation()
      ctx.emit('update:modelValue', model)
    }

    function validate() {
      const atr = authorType.value.validate()
      const idr = identifiers.value.validate()

      if (model.person_or_org.type === AUTHOR_TYPES.PERSON) {
        const gnr = givenName.value.validate()
        const fnr = familyName.value.validate()
        if (atr !== true ||
            gnr !== true ||
            fnr !== true ||
            idr !== true) {
          console.log('name ', gnr, fnr, idr)
          error.value = true
        }
      } else if (model.person_or_org.type === AUTHOR_TYPES.ORGANIZATION) {
        const nr = name.value.validate()
        if (atr !== true ||
            nr !== true ||
            idr !== true) {
          error.value = true
        }
      }
      console.log(error.value)

      return error.value ? 'error.validationFail' : true
    }

    return {
      input,
      authorType,
      givenName,
      familyName,
      name,
      identifiers,
      error,
      model,
      personName,
      authorLabel,
      validate,
      onChange,
      required,
      PERSON_IDENTIFIER_SCHEMES,
      AUTHOR_TYPES,
      AFFILIATIONS
    }
  }
}
</script>

<style scoped>

</style>
