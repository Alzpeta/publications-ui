import {computed, ref} from 'vue'
import {useRoute} from 'vue-router'
import {ARTICLES_COLLECTION_CODE, DATASETS_COLLECTION_CODE} from '@/constants'

export default function useCollection() {
    const route = useRoute()

    const isDatasets = computed(() => {
        return route.params.model === DATASETS_COLLECTION_CODE
    })

    const isArticles = computed(() => {
        return route.params.model === ARTICLES_COLLECTION_CODE
    })

    return {isDatasets, isArticles, model: ref(route.params.model)}
}
