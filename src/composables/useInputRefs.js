import {onBeforeUpdate, ref} from 'vue'

export default function useInputRefs() {
    const input = ref(null)
    const inputRefs = ref([])

    const setInputRef = el => {
        if (el) {
            inputRefs.value.push(el)
        }
    }

    onBeforeUpdate(() => {
        inputRefs.value = []
    })

    return {
        input,
        inputRefs,
        setInputRef
    }
}
