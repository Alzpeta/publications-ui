<template lang="pug">
.text-h7.text-grey-7.text-bold.text-uppercase
  q-icon.q-pr-sm(:name="icon" size="sm")
  span {{ $t(label) }}
</template>

<script>
export default {
  name: "SidebarSectionHeader",
  props: {
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'adjust'
    }
  }
}
</script>

<style scoped>

</style>
