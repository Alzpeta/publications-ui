<template lang="pug">
locale-select.full-width(
  menu-anchor="bottom left"
  filled
  square
  icon="flag"
  v-model="$i18n.locale")
</template>
<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'LocaleSwitcher'
})
</script>
