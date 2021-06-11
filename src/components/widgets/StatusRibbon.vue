<template lang="pug">
q-chip.absolute
  .text-accent.text-overline.text-bold(v-if="isDraft") DRAFT
  .text-accent.text-overline.text-bold(v-if="isEdited")
    q-tooltip {{ $t('label.isEdited') }}
  q-icon(
    :class="dense ? 'q-pa-xs' : 'q-pa-sm'"
    :size="dense ? 'sm' : 'md'"
    name="pending_actions"
    v-if="isPendingApproval")
    q-tooltip {{ $t('label.isPendingApproval') }}
  q-icon(
    :class="dense ? 'q-pa-xs' : 'q-pa-sm'"
    :size="dense ? 'sm' : 'md'"
    name="public" v-if="isPublic")
    q-tooltip {{ $t('label.isPublic') }}
  q-icon(
    :class="dense ? 'q-pa-xs' : 'q-pa-sm'"
    :size="dense ? 'sm' : 'md'"
    name="verified" v-if="isApproved")
    q-tooltip {{ $t('label.isApproved') }}
</template>
<script>
import {defineComponent} from 'vue'
import useState from '@/composables/useState'

export default defineComponent({
  name: 'StatusRibbon',
  props: {
    dense: {
      type: Boolean,
      default: true
    },
    metadata: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const {isApproved, isPendingApproval, isDraft, isPublic, isEdited} = useState(props.metadata)
    return {isApproved, isPendingApproval, isDraft, isPublic, isEdited}
  }
})
</script>
