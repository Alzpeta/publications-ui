<template lang="pug">
  q-layout.bg-grey-1(view="hhh lpR lFf")
    q-page-container
      router-view
</template>

<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'AdminLayout',
})
class AdminLayout extends Vue {
}
</script>
<style lang="sass">
</style>
