<template lang="pug">
q-dialog.taxonomy(ref="dialog" @hide="onDialogHide")
  q-card.q-dialog-plugin(style="width: 700px; max-width: 80vw;")
    q-card-section(v-if="title")
      .text-h6 {{ title }}
    q-card-section.q-mt-lg
      taxonomy-tree(
        :taxonomy="taxonomy"
        :start-expanded="true"
        :tree-options="opts"
        ref="tree"
        v-model="selected"
        :multiple="multiple"
        :initial-size="10")
    q-card-section(v-if="multiple")
      .row.items-end.q-gutter-md
        q-field.col(:label="$t('label.selectedTerm')" stack-label)
          template(v-slot:control)
            .row.items-end.q-gutter-sm
              q-chip(
                removable
                v-for="term in selected"
                :key="term.links.self"
                color="primary"
                outline
                @remove="valueUnselected(term)")
                term-span(
                  :term="term"
                  :taxonomy="taxonomy")
    q-card-actions(align="right")
      q-btn(@click="hide" flat color="grey") {{ $t('action.cancel') }}
      q-btn(@click="onOKClick" flat color="positive" icon="done" v-if="multiple")
        .q-pl-sm {{ $t('action.ok') }}
</template>

<script>
import {defineComponent, reactive, ref} from 'vue'
import TermSpan from '@/components/widgets/taxonomy/TermSpan'
import TaxonomyTree from '@/components/widgets/tree/TaxonomyTree'

export default defineComponent({
  name: 'TaxonomyInputDialog',
  components: {TermSpan, TaxonomyTree},
  emits: ['ok', 'hide'],
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    taxonomy: String,
    title: String,
    value: [Array, Object],
  },
  setup(props, ctx) {
    const dialog = ref(null)
    const tree = ref(null)
    const selected = ref([])
    const opts = reactive({
      checkbox: true,
      autoCheckChildren: false
    })

    function treeSelected(value) {
      if (props.multiple) {
        selected.value = value
      } else if (value.length) {
        ctx.emit('ok', value[0])
        hide()
      }
    }

    function valueUnselected(value) {
      selected.value = selected.value.filter(x => {
        return (x.slug !== value.slug)
      })
    }

    function show() {
      if (props.multiple) {
        selected.value = props.value || []
      } else if (props.value) {
        selected.value = props.value
      }
      dialog.value.show()
    }

    function hide() {
      dialog.value.hide()
    }

    function onDialogHide() {
      ctx.emit('hide')
    }

    function onOKClick() {
      ctx.emit('ok', selected.value)
      hide()
    }

    function onCancelClick() {
      hide()
    }

    return {
      dialog,
      tree,
      selected,
      opts,
      treeSelected,
      valueUnselected,
      show,
      hide,
      onDialogHide,
      onOKClick,
      onCancelClick
    }
  }
})
</script>

<style scoped>

</style>
