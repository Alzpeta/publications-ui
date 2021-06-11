<template lang="pug">
q-stepper(
  flat
  header-nav
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
      @next="step = steps.UPLOAD")
  q-step(
    icon="cloud_upload"
    :name="steps.UPLOAD"
    :title="$t('label.forms.uploadData')"
    :done="step > steps.UPLOAD")
    .column.justify-center.items-center
      .col.text-subtitle1 {{ $t('label.forms.uploadData') }}
    dataset-files(:dataset="record")
    stepper-nav(
      has-prev
      @prev="step = steps.AUTHORS"
      @next="step = steps.SUBMISSION"
    )
  q-step(
    active-icon="published_with_changes"
    icon="published_with_changes"
    :error="failed"
    :name="steps.SUBMISSION"
    :title="$t('label.forms.saveChanges')"
    :done="step > steps.SUBMISSION")
    .text-subtitle1.text-negative(v-if="failed")
      .block {{ $t('error.saveChangesFail') }}
        q-icon.q-ml-sm(name="sentiment_very_dissatisfied")
    stepper-nav(
      :has-prev="!saved && !failed"
      :has-retry="!saved && failed"
      :has-next="false"
      :has-save="!saved"
      @submit="save"
      @prev="step = steps.AUTHORS"
      @retry="retry")
    q-btn(v-if="saved" color="primary" :label="$t('action.navigateDetail')" :to="pathFromUrl(saved?.links?.self)")
    q-inner-loading(:showing="submitting")
      circular-spinner(:message="$t('message.savingChanges')")
</template>

<script>
import {defineComponent, ref} from 'vue'
import UploadData from '@/components/form/steps/UploadData'
import BasicInfo from '@/components/form/steps/BasicInfo'
import Identifiers from '@/components/form/steps/Identifiers'
import AuthorsContributors from '@/components/form/steps/AuthorsContributors'
import StepperNav from '@/components/navigation/StepperNav'
import {axios} from '@/boot/axios'
import useNotify from '@/composables/useNotify'
import DatasetFiles from '@/components/detail/DatasetFiles'
import {useRouter} from 'vue-router'

export const steps = Object.freeze({
  BASIC: 1,
  IDENTIFIERS: 2,
  AUTHORS: 3,
  SUBMISSION: 5,
  UPLOAD: 4
})

export default defineComponent({
  name: 'EditDatasetForm',
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  components: {DatasetFiles, AuthorsContributors, BasicInfo, UploadData, Identifiers, StepperNav},
  setup (props) {
    const {notifySuccess, notifyError} = useNotify()
    const router = useRouter()

    let formData = ref(props.record.metadata)
    const step = ref(steps.BASIC)
    const submitting = ref(false)
    const failed = ref(false)
    const saved = ref(false)

    function retry() {
      failed.value = false
      step.value = steps.BASIC
    }

    function _submissionFail (err) {
      console.log(err)
      failed.value = true
      notifyError('error.saveChangesFail')
    }

    function _submissionSuccess (response) {
      saved.value = response.data
      notifySuccess('message.saveChangesSuccess', {pid: saved.value.metadata.id})
      router.push(pathFromUrl(saved.value.links.self))
    }

    function pathFromUrl(url) {
      return new URL(url).pathname
    }

    function save() {
      submitting.value = true
      const submitUrl = props.record.http.data.links.self

      // TODO: change this upon createRecord implementation in invenio-vue library
      axios.put(submitUrl, JSON.stringify(formData.value), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(res => {
        if (res.status === 200) {
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

    return {formData, step, steps, saved, failed, save, retry, submitting, pathFromUrl}
  }
})
</script>

<style lang="sass" scoped>

</style>
