<template lang="pug">
q-dialog.q-pa-lg.dialog-window(
  ref='dialog' @hide='onDialogHide'
  :maximized="maximized"
  persistent
  transition-show="slide-up"
  transition-hide="slide-down")
  q-card.q-mt-xl
    q-bar.bg-dark-primary
      q-space
      q-btn(dense color="white" flat icon="minimize" @click="maximized = false" :disable="!maximized")
      q-btn(dense color="white" flat icon="crop_square" @click="maximized = true" :disable="maximized")
      q-btn(dense color="white" flat icon="close" v-close-popup)
    q-card-section.bg-primary.text-white
      .text-h4 {{ $t('action.attachArticle') }}
    q-card-section
      q-stepper(v-model="step" flat)
        q-step(name="1" :title="$t('label.importFromDOI')" :done="step > 1")
          doi-input(v-model="article.doi" ref="doi"
            @exists="articleExists"
            @resolve="articleResolved"
            @invalid="doiInvalid")
        q-step.full-width(name="2" :title="$t('label.articleMetadata')" :done="step > 2")
          q-input(v-model="article.title_lang" label="Title language *" :error="titleLangError" error-message="Wrong language format" @input="titleLangError=false")
          q-input(v-model="article.title_val" label="Title value *" :error="titleError" error-message="Title can't be empty" @input="titleError=false")
          q-input(v-model="article.abstract_lang" label="Abstract language" :error="abstractLangError" error-message="Wrong language format" @input="abstractLangError=false")
          q-input(v-model="article.abstract_val" label="Abstract value" :error="abstractError" error-message="Abstract can't be empty, if abstract language is filled" @input="abstractError=false" type="textarea")
          q-input(v-model="article.document_type" label="Document type *" :error="doctypeError" error-message="Document type can't be empty" @input="doctypeError=false")
          q-input(v-model="article.publication_year" type="number" label="Publication year *" :error="yearError" error-message="Publication year is required and must be valid year" @input="yearError=false")
          .text {{ $t('label.authors') }} *
          q-card-section(v-for='(input,k) in authors_inputs' :key='k' )
            q-input(
              type='text'
              label="Author"
              :label='String(k + 1)'
              v-model='input.full_name'
              :error="authorError[k]"
              error-message="Authors name can't be empty"
              @input="authorError[k]=false")
          q-btn(:label="$t('action.addAuthor')" flat color="positive" icon="add" @click="addAuthor(k)")
            q-space
          q-btn(
            :label="$t('action.removeAuthor')"
            flat color="negative"
            @click="removeAuthor(k)"
            icon="remove"
            v-show='authors_inputs.length > 1')
    q-card-actions(align='right' v-if="step==='1'").q-pa-md
      q-btn.q-mb-sm(color='grey' :disable="validatingDOI" flat :label="$t('label.skipDOI')" @click='skipDOI')
      q-space
      q-btn.full-width(
        color='primary'
        :disable="validatingDOI"
        :label="$t('label.importFromDOI')"
        @click='next'
        :loading="validatingDOI")
        template(v-slot:loading)
          .row.full-width.no-wrap.q-gutter-md.justify-center
            .col-auto {{ $t('message.loadingMetadata') }}
            q-spinner-puff.col-auto
    q-card-actions.q-mb-xl.q-mx-lg(align='right' v-if="step==='2'")
      q-btn.q-mb-xl.q-ml-md(
        color='grey'
        flat
        :disable="creatingArticle"
        :label="$t('label.back')" @click='back')
      q-space
      q-btn.col-auto.q-mb-xl.q-mr-lg(
        color='positive'
        size="lg"
        :disable="creatingArticle"
        :label="$t('label.createArticle')"
        @click='createArticle'
        :loading="creatingArticle")
        template(v-slot:loading)
          .row.full-width.no-wrap.q-gutter-md.justify-center
            .col-auto {{ $t('message.creatingArticle') }}
            q-spinner-puff.col-auto
</template>

<script>
import axios from 'axios'
import DOIInput from "@/components/widgets/forms/DOIInput";
import {ARTICLES_COLLECTION_CODE} from "@/constants";

export default {
  props: {
    dataset: Object,
    datasetLinks: Object
  },
  components: {
    'doi-input': DOIInput,
  },
  data() {
    return {
      maximized: false,
      k: 0,
      step: '1',
      validatingDOI: false,
      creatingArticle: false,
      authorError: [false],
      generated_article: {},
      article: {
        doi: '',
        title_lang: '',
        abstract_lang: '',
        abstract_val: '',
        title_val: '',
        document_type: '',
        publication_year: ''
      },
      authors_inputs: [{full_name: ''}],
      titleError: false,
      titleLangError: false,
      abstractError: false,
      abstractLangError: false,
      doctypeError: false,
      yearError: false,
      communityId: this.$route.params.communityId
    }
  },

  methods: {
    validate() {
      console.log(this.dataset)
      for (var k = 0; k < this.authors_inputs.length; k++) {
        if (this.authors_inputs[k].full_name === '') {
          this.authorError[k] = true
        }
      }
      if (this.article.title_val === '') {
        this.titleError = true
      }
      if (this.article.document_type === '') {
        this.doctypeError = true
      }
      const langRegex = /^([a-z][a-z])$|^([a-z][a-z]-[a-z][a-z])$|^_$/

      if (this.article.title_lang === '' || !(this.article.title_lang.match(langRegex))) {
        this.titleLangError = true
      }
      if ((this.article.abstract_lang === '' && this.article.abstract_val !== '') ||
          (!(this.article.abstract_lang.match(langRegex)) && this.article.abstract_lang !== '')) {
        this.abstractLangError = true
      }
      if (this.article.abstract_lang !== '' && this.article.abstract_val === '') {
        this.abstractError = true
      }
      if (this.article.publication_year === '' || isNaN(this.article.publication_year)) {
        this.yearError = true
      }
    },
    show() {
      this.$refs.dialog.show()
    },

    hide() {
      this.$refs.dialog.hide()
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    addAuthor() {
      this.authors_inputs.push({full_name: ''})
      this.authorError.push(false)
    },

    removeAuthor(index) {
      const lastValue = this.authors_inputs.length - (index + 1)
      this.authors_inputs.splice(lastValue, 1)

      const lastErrorValue = this.authorError.length - (index + 1)
      this.authorError.splice(lastErrorValue, 1)
    },

    articleExists(article) {
      // Called then article with a given DOI already exists
      console.log('article exists in repo', article.metadata)
      axios.patch(
          article.links.self,
          [{
            op: 'add',
            path: '/datasets/-',
            value: {
              pid_value: this.dataset.id,
              'oarepo:draft': this.dataset['oarepo:draft']
            }
          }], {headers: {'Content-Type': 'application/json-patch+json'}})
          .then(() => {
            this.$router.push({
              name: `detail`,
              params: {model: ARTICLES_COLLECTION_CODE, communityId: this.communityId, recordId: article.metadata.id}
            })
            this.hide()
          }).catch(err => {
        this.articleCreateFailed(err)
      }).finally(() => {
        this.creatingArticle = false
        this.validatingDOI = false
      })
    },

    articleResolved(article) {
      console.log('article resolved from DOI', article)
      this.validatingDOI = false
      this.generated_article = article
      this.article.document_type = article.document_type
      this.article.publication_year = article.publication_year
      try {
        this.article.abstract_val = article.abstract[Object.keys(article.abstract)[0]]
        this.article.abstract_lang = Object.keys(article.abstract)[0]
      } catch { // abstract is not required
        this.article.abstract_val = ''
        this.article.abstract_lang = '_' // default language value
      }

      this.article.title_val = article.title[Object.keys(article.title)[0]]
      this.article.doi = this.$refs.doi.doi
      this.article.title_lang = Object.keys(article.title)[0]

      for (let i = 0; i < article.authors.length; i++) {
        if (i === 0) {
          this.authors_inputs[0].full_name = article.authors[0].full_name
        } else {
          this.authors_inputs.push({full_name: article.authors[i].full_name})
          this.authorError.push(false)
        }
      }
      this.step = '2'
      this.maximized = true
    },

    doiInvalid() {
      this.validatingDOI = false
    },

    articleCreateFailed(err) {
      console.log(err)
      this.$q.notify({
        message: this.$t('message.errorCreatingArticle'),
        icon: 'announcement',
        color: 'negative'
      })
    },

    next() {
      console.log('val')
      this.validatingDOI = true
      this.titleError = false
      this.abstractLangError = false
      this.titleLangError = false
      this.doctypeError = false
      this.abstractError = false
      this.yearError = false
      this.$refs.doi.validate()
    },
    skipDOI() {
      this.maximized = true
      this.step = '2'
    },
    back() {
      this.maximized = false
      this.step = '1'
    },
    createArticle() {
      this.creatingArticle = true
      this.titleError = false
      this.abstractLangError = false
      this.titleLangError = false
      this.doctypeError = false
      this.abstractError = false
      this.yearError = false
      for (var k = 0; k < this.authorError.length; k++) {
        this.authorError[k] = false
      }
      this.validate()
      let authorErr = false
      for (k = 0; k < this.authorError.length; k++) {
        if (this.authorError[k] === true) {
          authorErr = true
          break
        }
      }
      if (this.titleError || authorErr || this.titleLangError || this.abstractLangError || this.doctypeError || this.yearError) { // if errors in validation
        // TODO(alzpeta): show error to user using Quasar Notify plugin
        this.creatingArticle = false
      } else {
        const datasetUrl = this.datasetLinks.self
        if (this.article.doi !== '') {
          this.updateArticle() // set changes
          this.updateDatasetArray(this.generated_article, this.dataset) // set datasets
          this.generated_article._primary_community = this.communityId
          axios.post(`/${this.communityId}/articles/draft/`, this.generated_article)
              .then((response) => {
                const articleId = response.data.metadata.id
                this.$router.push({
                  name: 'detail',
                  params: {
                    model: ARTICLES_COLLECTION_CODE,
                    communityId: this.generated_article._primary_community,
                    recordId: articleId
                  }
                })
              }).catch((err) => {
            this.articleCreateFailed(err)
          }).finally(() => {
            this.creatingArticle = false
            this.validatingDOI = false
          })
        } else {
          axios.post(
              `${this.generated_article._primary_community}/articles/draft/without_doi/`,
              {changes: this.article, authors: this.authors_inputs, datasetUrl: datasetUrl})
              .then((response) => {
                const articleId = response.data.metadata.id
                this.$router.push({
                  name: 'detail',
                  params: {communityId: this.communityId, model: ARTICLES_COLLECTION_CODE, recordId: articleId}
                })
              }).catch((err) => {
            this.articleCreateFailed(err)
          }).finally(() => {
            this.creatingArticle = false
            this.validatingDOI = false
          })
        }
        this.hide()
      }
    },
    updateDatasetArray(article, dataset) {
      article.datasets.push({
        pid_value: dataset.id,
        'oarepo:draft': dataset['oarepo:draft']
      })
    },
    updateArticle() {
      var newAbstract = JSON.parse('{}')
      newAbstract[this.article.abstract_lang] = this.article.abstract_val
      var newTitle = JSON.parse('{}')
      newTitle[this.article.title_lang] = this.article.title_val
      this.generated_article.title = newTitle
      this.generated_article.abstract = newAbstract
      this.generated_article.authors = this.authors_inputs
      this.generated_article.document_type = this.article.document_type
      this.generated_article._primary_community = this.dataset._primary_community
      this.generated_article.access_right_category = 'success'
    },
    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok')
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide()
    }
  }
}
</script>
<style lang="sass">
//.dialog-window
//  z-index: 7100 !important
</style>
