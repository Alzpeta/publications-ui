<template lang="pug">
q-stepper(
  flat
  keep-alive
  v-model="step"
  doneIcon="done"
  done-color="positive"
  vertical
  color="primary"
  animated)
  q-step(
    icon="info"
    :name="steps.BASIC"
    :title="$t('label.forms.basicInfo')"
    :done="step > steps.BASIC"
    done-icon="done"
    done-color="positive")
    basic-info(
      v-model="formData"
      @next="step = steps.IDENTIFIERS")
  q-step(
    icon="tag"
    :name="steps.IDENTIFIERS"
    :title="$t('label.forms.identifiers')"
    :caption="$t('label.forms.identifiersCaption')"
    :done="step > steps.IDENTIFIERS")
    identifiers(s
    v-model="formData"
      @next="step = steps.AUTHORS"
      @prev="step = steps.BASIC")
  q-step(
    icon="groups"
    :name="steps.AUTHORS"
    :title="$t('label.forms.authorsContributors')"
    :done="step > steps.AUTHORS")
    authors-contributors(
      v-model="formData"
      @prev="step = steps.IDENTIFIERS"
      @next="step = steps.SUBMISSION"
      @submit="submit")
  q-step(
    active-icon="published_with_changes"
    icon="published_with_changes"
    :error="failed"
    :name="steps.SUBMISSION"
    :title="$t('label.forms.submission')"
    :done="step > steps.SUBMISSION")
    .text-subtitle2 {{ $t('message.submissionInfo') }}
    .text-subtitle1.text-negative(v-if="failed")
      .block {{ $t('error.submissionFail') }}
        q-icon.q-ml-sm(name="sentiment_very_dissatisfied")
    stepper-nav(
      :has-prev="!created && !failed"
      :has-retry="!created && failed"
      :has-submit="!created && !failed"
      :has-next="false"
      @submit="submit"
      @prev="step = steps.AUTHORS"
      @retry="retry")
    q-inner-loading(:showing="submitting")
      circular-spinner(:message="$t('message.submitting')")
  q-step(
    icon="cloud_upload"
    :name="steps.UPLOAD"
    :title="$t('label.forms.uploadData')")
    .column.justify-center.items-center
      .col.text-h2
        q-icon.flex-center(color="positive" name="check_circle")
      .col.text-h5 {{ $t('message.submissionSuccess', {pid: created.metadata.id}) }}
    q-separator(spaced)
    .column.justify-center.items-center
      .col.text-subtitle1 {{ $t('label.forms.uploadData') }}
    upload-data(v-if="created" :files="created.links.files")
    .column.justify-center.items-center
      .col.text-subtitle1.q-my-md ~ {{ $t('label.or') }} ~
      .col
        q-btn(color="primary" :label="$t('action.navigateDetail')" :to="pathFromUrl(created?.links?.self)")
</template>

<script>
import {defineComponent, ref} from 'vue'
import UploadData from '@/components/form/steps/UploadData'
import BasicInfo from '@/components/form/steps/BasicInfo'
import Identifiers from '@/components/form/steps/Identifiers'
import AuthorsContributors from '@/components/form/steps/AuthorsContributors'
import StepperNav from '@/components/navigation/StepperNav'
import {axios} from '@/boot/axios'
import useCollection from '@/composables/useCollection'
import useNotify from '@/composables/useNotify'

export const steps = Object.freeze({
  BASIC: 1,
  IDENTIFIERS: 2,
  AUTHORS: 3,
  SUBMISSION: 4,
  UPLOAD: 5
})

export default defineComponent({
  name: 'CreateDatasetForm',
  components: {AuthorsContributors, BasicInfo, UploadData, Identifiers, StepperNav},
  setup() {
    const {model} = useCollection()
    const {notifySuccess, notifyError} = useNotify()

    const formData = ref({})
    const step = ref(steps.BASIC)
    const submitting = ref(false)
    const failed = ref(false)
    const created = ref(false)

    function retry() {
      failed.value = false
      step.value = steps.BASIC
    }

    function _submissionFail (err) {
      console.log(err)
      failed.value = true
      notifyError('error.submissionFail')
    }

    function _submissionSuccess (response) {
      created.value = response.data
      notifySuccess('message.submissionSuccess', {pid: created.value.metadata.id})
      step.value = steps.UPLOAD
    }

    function pathFromUrl(url) {
      return new URL(url).pathname
    }

    function submit() {
      submitting.value = true

      // Set internal metadata fields
      // TODO: migrate to taxonomy terms
      formData.value['resource_type'] = {type: `${window.location.origin}/2.0/taxonomies/resourceType/datasets`}

      const submitUrl = `/${formData.value._primary_community}/${model.value}/draft/`

      // TODO: change this upon createRecord implementation in invenio-vue library
      axios.post(submitUrl, JSON.stringify(formData.value), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(res => {
        if (res.status === 201) {
          _submissionSuccess(res)
          return
        }
        _submissionFail(res)
      }).catch(err => {
        _submissionFail(err)
      }).finally(() => {
        submitting.value = false
      })
    }

    return {formData, step, steps, created, failed, submit, retry, submitting, pathFromUrl}
  }
})
</script>

<style lang="sass" scoped>

</style>
