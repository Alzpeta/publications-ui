<template lang="pug">
q-input(v-model="doi"
        autofocus
        :label="$t('label.enterArticleDOI')"
        :error="doiError"
        :error-message="$t('message.resolveDOIError')"
        @input="doiError=false")
</template>

<script>
import {defineComponent, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useQuasar} from "quasar";
import {useI18n} from "vue-i18n";
import {axios} from "@/boot/axios";
import {ARTICLES_COLLECTION_CODE} from "@/constants";

export default defineComponent({
  props: {
    val: String
  },
  emits: ['exists', 'resolve'],
  setup (props, ctx) {
    const route = useRoute()
    const communityId = route.params.communityId
    const router = useRouter()
    const $q = useQuasar()
    const {t} = useI18n()

    const doi = ref(props.val || '')
    const doiError = ref(false)

    watch((props.val), () => {
        doi.value = props.val
    })

    function articlesActionUrl (action) {
      const articlesApi = router.resolve({
        name: 'community-list',
        params: {
          communityId: communityId,
          state: 'draft',
          model: ARTICLES_COLLECTION_CODE
        }
      }).href
      return `${articlesApi}/${action}/`
    }

    function confirm (articleLinks, article) {
      $q.dialog({
        title: t('section.articleExistsError'),
        message: t('message.articleExistsError'),
        cancel: true,
        contentStyle: { zIndex: 8000 }
      }).onOk(async () => {
        ctx.emit('exists', { links: articleLinks, metadata: article })
        // TODO: move this logic to NewArticleDialog
        doiError.value = false
      }).onCancel(() => {
        doiError.value = false
        ctx.emit('resolve', {})
      }).onDismiss(() => {
        doiError.value = false
        ctx.emit('resolve', {})
      })
    }

    function validate () {
      axios.post(
          `${articlesActionUrl('from-doi')}`,
          { doi: doi.value })
          .then((response) => {
            const articleLinks = response.data?.links
            const article = response.data?.article

            if (articleLinks && doi.value !== '') {
              confirm(articleLinks, article)
              return
            }
            if (article && doi.value !== '') {
              doiError.value = false
              ctx.emit('resolve', article)
            } else {
              doiError.value = true
            }
          }).catch(err => {
        console.log(err)
        doiError.value = true
        ctx.emit('invalid', doi.value)
      })
    }

    return {doi, doiError, articlesActionUrl, confirm, validate}
  }
})
</script>
