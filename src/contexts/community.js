import {defineContext} from 'vue-context-composition'
import {computed, ref, readonly} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {axios} from '@/boot/axios'

export const community = defineContext(() => {
    const route = useRoute()
    const router = useRouter()
    const communities = ref([])
    const loading = ref(false)

    function loadCommunities() {
        loading.value = true
        axios.get('/communities/')
            .then(resp => {
                communities.value = resp.data
            }).finally(() => {
                loading.value = false
            })
    }

    async function setCommunity(communityId) {
        let routeParams = {
            model: route.params.model,
            state: route.params.state
        }

        if (communityId) {
            return await router.push({
                name: 'community-list',
                params: {
                    communityId: communityId,
                    ...routeParams
                }
            })
        }
        await router.push({name: 'list', params: routeParams})
    }

    const communityId = computed(() => {
        return route.params.communityId
    })

    const currentCommunity = computed(() => {
        return communities.value?.find((c) => c.id === communityId.value)
    })

    return {
        loadCommunities,
        setCommunity,
        communities: readonly(communities),
        communityId: readonly(communityId),
        currentCommunity: readonly(currentCommunity),
        communitiesLoading: readonly(loading)
    }
})
