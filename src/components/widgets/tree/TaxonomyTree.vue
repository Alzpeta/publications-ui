<template lang="pug">
div.q-pa-md.q-gutter-sm
  q-tree(
    ref="tree"
    v-if="dataReady"
    :nodes="data"
    tick-strategy="leaf"
    :ticked="selected"
    :default-expand-all="startExpanded"
    node-key="self"
    @update:model-value="valueChanged"
    @update:ticked="onTicked($event)"
    accordion)
</template>
<script>
import {computed, defineComponent, nextTick, onMounted, ref, watch} from 'vue'
import useTaxonomy from '@/composables/useTaxonomy'
import {useTranslated} from '@/composables/useTranslated'
import {useI18n} from 'vue-i18n'

export default defineComponent({
  name: 'TaxonomyTree',
  emits: ['loaded', 'input', 'update:modelValue'],
  props: {
    taxonomy: String,
    startExpanded: Boolean,
    treeOptions: {
      type: Object,
      default: () => ({
        checkbox: false,
        dnd: false
      })
    },
    initialSize: {
      type: Number,
      default: 50
    },
    multiple: {
      type: Boolean,
      default: false
    },
    modelValue: [Object, Array]
  },
  setup(props, ctx) {
    const {locale} = useI18n()
    const {loadTaxonomyPage} = useTaxonomy()
    const {mt} = useTranslated(locale)

    const tree = ref(null)
    // const filter = ref('')
    const activatedFilter = ref('')
    const data = ref([])
    const dataReady = ref(false)
    const taxonomyUrlStack = ref([])
    // const taxonomyTermStack = ref([])
    // const pageStack = ref([])
    const page = ref(1)
    const size = ref(0)
    const total = ref(0)
    const singleLevel = ref(false)
    const selected = ref(props.modelValue || [])
    // const checkRunning = ref(false)
    const deleted = ref(false)

    onMounted(() => {
      size.value = props.initialSize
      loadTaxonomy()
      valueChanged()
    })

    watch(props.modelValue, () => {
      valueChanged()
    })

    function valueChanged() {
      selected.value = props.modelValue.map(t => t.links.self) || []
    }

    function processData(data) {
      return data.map(x => {
        if (x.children !== undefined) {
          x.children = processData(x.children)
        }
        x.data = {...x}
        delete x.data.children

        if (x.icon && x.icon.startsWith('http')) {
          x.icon = `img:${x.icon}`
        }

        x.self = x.links.self
        x.label = mt(x.title)
        return x
      })
    }

    function loadTaxonomy() {
      loadTaxonomyPage({
        code: props.taxonomy,
        page: page.value,
        size: size.value,
        url: localTaxonomyUrl.value,
        filter: activatedFilter.value,
        levels: singleLevel.value ? 1 : undefined,
        deleted: deleted.value
      }).then(({terms, count}) => {
        // terms starts with taxonomy node
        data.value = processData(terms.children)
        total.value = count
        dataReady.value = false
        nextTick(() => {
          dataReady.value = true
          later(() => {
            // valueChanged()
            ctx.emit('loaded', {
              tree: tree,
              page: page.value,
              terms: terms,
              total: total.value,
              size: size.value
            })
          })
        })
      })
    }

    watch(page, () => {
      pageChanged()
    })

    function pageChanged() {
      loadTaxonomy()
    }

    // function openTaxonomy({term}) {
    //   taxonomyTermStack.value.push(term)
    //   taxonomyUrlStack.value.push(term.links.self)
    //   pageStack.value.push(page.value)
    //   if (page.value !== 1) {
    //     page.value = 1 // no need to reload as it is automatic on page change
    //   } else {
    //     loadTaxonomy()
    //   }
    // }

    // function taxonomyUp() {
    //   taxonomyUrlStack.value.pop()
    //   taxonomyTermStack.value.pop()
    //   page.value = pageStack.value.pop()
    //   loadTaxonomy()
    // }

    // const parentListTerm = computed(() => {
    //   if (taxonomyTermStack.value.length) {
    //     return taxonomyTermStack.value[taxonomyTermStack.value.length - 1]
    //   }
    //   return undefined
    // })

    const localTaxonomyUrl = computed(() => {
      if (taxonomyUrlStack.value.length > 0) {
        return taxonomyUrlStack.value[taxonomyUrlStack.value.length - 1]
      }
      return undefined
    })
    //
    // const hasParent = computed(() => {
    //   return taxonomyUrlStack.value.length
    // })
    //
    // function search() {
    //   activatedFilter.value = filter.value
    //   if (page.value !== 1) {
    //     page.value = 1
    //   } else {
    //     loadTaxonomy()
    //   }
    // }

    const maxPage = computed(() => {
      return Math.ceil(total.value / (size.value || 1))
    })

    // const parentUrl = computed(() => {
    //   // returns local url (if nested) or the collection's url
    //   return localTaxonomyUrl.value || taxonomyUrl(props.taxonomy)
    // })
    //
    // function prepend(...params) {
    //   const node = tree.value.prepend(...params)
    //   node.select()
    // }

    // function check() {
    //   checkRunning.value = true
    //   checkRunning.value = false
    // }

    function later(f) {
      const cnt = []

      function l() {
        if (!tree.value) {
          if (cnt.length < 5) {
            cnt.push(1)
            setTimeout(l, 100 * cnt.length)
          }
        } else {
          f()
        }
      }

      setTimeout(l, 0)
    }

    // function expand() {
    //   later(() => tree.value.findAll({}).expand())
    // }
    //
    // function collapse() {
    //   later(() => tree.value.findAll({}).collapse())
    // }

    // function clicked(term, node) {
    //   if (term.descendants_count > 0) {
    //     if (node.children.length) {
    //       if (node.expanded()) {
    //         later(() => {
    //           node.collapse()
    //         })
    //       } else {
    //         later(() => {
    //           node.expand()
    //         })
    //       }
    //     } else {
    //       openTaxonomy({term, node})
    //     }
    //     return
    //   }
    //   selected.value = [term]
    //   ctx.emit('input', selected.value)
    // }

    // function checked(term) {
    //   if (checkRunning.value) {
    //     return
    //   }
    //   for (const t of selected.value) {
    //     if (t.slug === term.slug) {
    //       return
    //     }
    //   }
    //   if (props.multiple) {
    //     selected.value.push(term)
    //   } else {
    //     selected.value = [term]
    //   }
    //   ctx.emit('input', selected.value)
    // }

    // function unchecked(term) {
    //   if (checkRunning.value) {
    //     return
    //   }
    //   if (!props.multiple) {
    //     return
    //   }
    //   const prevSelected = selected.value
    //   selected.value = selected.value.filter(x => x !== term)
    //   if (prevSelected.length !== selected.value.length) {
    //     ctx.emit('input', selected.value)
    //   }
    // }

    function onTicked(term) {
      selected.value = term
      const val = selected.value.map(v => {
        return data.value.find(t => {
          return t.links.self === v
        })
      })
      ctx.emit('update:modelValue', val)
    }

    return {
      tree,
      data,
      dataReady,
      // clicked,
      // checked,
      // unchecked,
      // taxonomyUp,
      // prepend,
      // collapse,
      // parentListTerm,
      // expand,
      // hasParent,
      // search,
      maxPage,
      // parentUrl,
      selected,
      valueChanged,
      onTicked
    }
  }
})
</script>

<style lang="sass">
.q-tree__icon
  object-fit: contain !important
  width: 3em !important
  max-height: 2rem !important
</style>
