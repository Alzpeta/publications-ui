<template lang="pug">
q-input.search(
  clearable
  type="search"
  clear-icon="clear"
  dark
  hide-bottom-space
  standout
  square
  @clear="clear"
  input-class="full-height search__input"
  :debounce="1000"
  :placeholder="$t('label.searchInput') + '…'"
  v-model="query.q"
  @keyup.enter='onEnter'
  ref="input")
  template(v-slot:append)
    q-icon(v-if="query.q === ''" name="search")
</template>

<script>
import {defineComponent, ref, watch} from 'vue'
import {useQuery} from '@oarepo/vue-query-synchronizer'
import deepcopy from 'deepcopy'
import {useRouter} from 'vue-router'

export default defineComponent({
  name: 'SearchInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    route: Object
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const query = useQuery()
    const router = useRouter()

    const input = ref()
    const model = ref(props.modelValue || query.q)

    watch(() => props.modelValue, () => {
      if (props.modelValue !== model.value) {
        model.value = props.modelValue
      }
    })

    watch(model, (val) => {
      if (!props.route) {
        query.q = val
      }
    })

    function clear() {
      model.value = ''
      input.value.focus()
    }

    function onEnter() {
      if (props.route) {
        const r = deepcopy(props.route)
        if (!r.query) {
          r.query = {}
        }
        r.query.q = model.value
        router.push(r)
      } else {
        query.q = model.value
      }
      query.page = 1
      ctx.emit('update:modelValue', model.value)
    }

    return {query, input, clear, onEnter}
  }
})
</script>

<style lang="sass" scoped>
.search
  &__input
    padding-left: 1rem
</style>
