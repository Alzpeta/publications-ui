<template lang="pug">
q-btn.q-mt-xl(
  color="white"
  text-color="blue"
  unelevated
  to="/"
  :label="$t('label.goHome')"
  no-caps
)
</template>

<script>
export default {
  name: "GoHomeBtn"
}
</script>
