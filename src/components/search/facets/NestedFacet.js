import {useComponent} from "@oarepo/quasar-es-facets";
import {computed, defineComponent, unref} from "vue";
import {useShownFacets} from "@oarepo/quasar-es-facets";
import {useFacetProps} from "@oarepo/quasar-es-facets";

export default defineComponent({
    name: 'NestedFacet',
    props: {
        ...useFacetProps()
    },
    inheritAttrs: false,
    emits: ['facetSelected', 'facetActivated', 'facetDeactivated'],
    setup(props, ctx) {
        const c = useComponent(props.definition, props.options)
        const aggsProps = computed(() => {
            const p = unref(props)
            return {
                ...p,
                facets: p.facet.aggs || {}
            }
        })
        const {preprocessedFacets} = useShownFacets(
            aggsProps.value, c, 'facet', false)

        return () => {
            return preprocessedFacets.value.map(facet => {
                    if (!facet.definition.facetComponent) {
                        facet.definition.facetComponent = c.getComponent('facet', facet)
                    }
                    return c.hd(facet.definition.facetComponent, {
                        options: props.options,
                        facet,
                        facetSelection: props.facetSelection,
                        activeFacets: props.activeFacets,
                        key: facet.definition.path,
                        onFacetSelected: value => ctx.emit('facetSelected', value),
                        onFacetActivated: value => ctx.emit('facetActivated', value),
                        onFacetDeactivated: value => ctx.emit('facetDeactivated', value)
                    })
                }
            )
        }
    }
})
