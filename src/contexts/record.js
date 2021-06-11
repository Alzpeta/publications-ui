import {defineContext} from 'vue-context-composition'
import {ref, readonly, watchEffect} from 'vue'
import {useRoute} from 'vue-router'

export const record = defineContext(() => {
    const recordSidebarVisible = ref(true)
    const recordSidebarEnabled = ref(false)
    const route = useRoute()

    watchEffect(() => {
        if (route.meta.useRecordActions) {
            setTimeout(() => {
                recordSidebarEnabled.value = true
            })
        } else {
            recordSidebarEnabled.value = false
        }
    })


    const toggleRecordSidebar = () => {
        recordSidebarVisible.value = !recordSidebarVisible.value
    }

    return {
        recordSidebarEnabled,
        recordSidebarVisible: readonly(recordSidebarVisible),
        toggleRecordSidebar
    }
})
