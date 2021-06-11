import {computed, ref} from 'vue'
import deepmerge from 'deepmerge'


export default function useFacets(collection) {
    const defaults = ref({
        components: {
            bucketsContainer: {
                component: 'facet-container'
            },
            listBucketCheckbox: {
                attrs: {
                    color: 'secondary',
                    keepColor: true
                }
            }
        }
    })

    const types = ref({
        nested: {
            components: {
                facet: {
                    component: 'nested-facet'
                }
            }
        }
    })

    const definitions = ref({
        contributors: {
            type: 'nested',
            aggs: {
                inner_facet: {
                    label: "contributors"
                }
            }
        },
        resourceType: {
            type: 'nested',
            aggs: {
                inner_facet: {
                    label: "resourceType"
                }
            }
        },
        languages: {
            type: 'nested',
            aggs: {
                inner_facet: {
                    label: "languages"
                }
            }
        },
        rights: {
            type: 'nested',
            aggs: {
                inner_facet: {
                    label: "rights"
                }
            }
        }
    })

    async function facetLoader(facetSelection, activeFacets, excludedFromQuery /*, extras = {}*/) {
        const fetchedFacets = new Set([...Object.keys(facetSelection.selected()), ...Object.keys(activeFacets)])
        if (!fetchedFacets.size) {
            return {}
        }
        const facets = await collection.httpFacets.load({
            query: {
                facets: [...Array.from(fetchedFacets.values()).map(transformFacet)].join(','),
                ...Object.entries(facetSelection.selected()).reduce(
                    (p, s) => {
                        if (!(excludedFromQuery && excludedFromQuery.includes(s[0]))) {
                            p[transformFacet([0])] = [...s[1]].map(x => x.toString())
                        }
                        return p
                    }, {}),
                size: 1
            },
            returnPromise: true
        })
        return facets.aggregations
    }

    const facetDefinitions = computed(() => {
        const cols = collection.facetDefinitions
        // eslint-disable-next-line no-unused-vars
        for (const [k, val] of Object.entries(cols)) {
            if (definitions.value[k]) {
                cols[k] = deepmerge(cols[k], definitions.value[k])
            }
        }
        return cols
    })

    function transformFacet(f) {
        if (f.split) {
            return f.split('.')[0]
        } else {
            return f
        }
    }

    return {
        defaults,
        types,
        definitions,
        facetDefinitions,
        facetLoader,
        transformFacet
    }
}
