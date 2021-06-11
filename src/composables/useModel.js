import {computed} from 'vue'

export default function useModel(ctx, model) {
    function onChange () {
        ctx.emit('update:modelValue', model.value)
    }

    const isEmpty = computed(() => {
        return model.value.length === 0
    })

    return {onChange, isEmpty}
}
