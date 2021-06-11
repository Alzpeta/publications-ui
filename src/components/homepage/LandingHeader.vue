<template lang="pug">
q-header.row.z-top.no-wrap
    q-toolbar.col-12.col-md-7.q-py-md.q-px-sm.q-px-sm-xl.bg-primary.justify-between
      q-btn.col-4(flat :to="{ name: 'homepage' }")
        img.logo(src="logos/datacare_White.svg")
      q-space
      account-dropdown.lt-md.q-mr-sm(:authenticated="authenticated")
    q-toolbar.gt-sm.col-5.q-py-md.q-pr-xl.bg-white.justify-end.items-center
      account-dropdown.q-mr-sm(dark :authenticated="authenticated")
</template>

<script>
import AccountDropdown from '@/components/account/AccountDropdown'
import {defineComponent} from 'vue'
import useAuth from "@/composables/useAuth";

export default defineComponent({
  name: 'LandingHeader',
  components: {
    AccountDropdown
  },
  setup () {
    const { authenticated } = useAuth()

    return { authenticated }
  }
})
</script>

<style lang="sass" scoped>
img
  width: 100%

.logo
  max-height: 70px
</style>
