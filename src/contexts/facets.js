import {defineContext} from 'vue-context-composition'
import {ref, readonly, watchEffect} from 'vue'
import {useRoute} from 'vue-router'

export const facets = defineContext(() => {
    const route = useRoute()

    const activeFacets = ref(null)
    const facetsEnabled = ref(false)
    const facetsSidebarVisible = ref(true)

    watchEffect(() => {
        if (route.meta.useFacets) {
            setTimeout(() => {
                facetsEnabled.value = true
            })
        } else {
            facetsEnabled.value = false
        }
    })

    const toggleFacetsSidebar = () => {
        facetsSidebarVisible.value = !facetsSidebarVisible.value
    }

    return {
        activeFacets,
        facetsEnabled: readonly(facetsEnabled),
        facetsSidebarVisible: readonly(facetsSidebarVisible),
        toggleFacetsSidebar
    }
})
