<template lang="pug">
q-pagination.q-mt-lg(
  v-if="collection.pages > 1"
  :input="true" v-model="query.page" :max="collection.pages" :max-pages="10" color="grey-5"
  direction-links boundary-numbers size="lg")
</template>

<script>
import {defineComponent} from 'vue'
import {useQuery} from '@oarepo/vue-query-synchronizer'

export default defineComponent({
  name: 'Pagination',
  props: {
    collection: {
      type: Object,
      required: true
    }
  },
  setup () {
    const query = useQuery()
    return {query}
  }
})
</script>

<style lang="sass" scoped>
</style>
