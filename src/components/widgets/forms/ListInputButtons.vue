<template lang="pug">
q-btn(v-if="canRemove" round dense flat color="negative" icon="backspace" @click="$emit('remove')")
  q-tooltip {{ $t('action.rmItem') }}
q-btn(round dense flat color="positive" icon="post_add" @click="$emit('add')")
  q-tooltip {{ $t('action.addItem') }}
</template>

<script>
export default {
  name: 'ListInputButtons',
  props: {
    canRemove: {
      type: Boolean,
      default: false
    }
  },
  emits: ['remove', 'add'],
}
</script>
<style lang="sass" scoped>
</style>
