<template lang="pug">
.fullscreen.bg-primary.text-white.text-center.q-pa-md.flex.flex-center
  div
    q-icon.q-pa-md(name="exit_to_app" style="font-size: 20vh" size="xl")
    .text-h2(style="opacity:.6") {{ $t('message.loggedOut') }}…
    go-home-btn
</template>

<script>
import GoHomeBtn from '@/components/widgets/button/GoHomeBtn'

export default {
  name: 'LoggedOut',
  components: {GoHomeBtn}
}
</script>
