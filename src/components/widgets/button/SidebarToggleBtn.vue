<template lang="pug">
q-btn.q-mx-md(
  v-if="$route.meta.useFacets || $route.meta.useRecordActions"
  flat
  @click="toggle"
  round
  dense
  icon="menu")
.col-1(v-else)
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'SidebarToggleBtn',
  props: {
    toggle: {
      type: Function
    }
  }
})
</script>
