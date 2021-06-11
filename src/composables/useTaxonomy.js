import {ref} from "vue";
import {axios} from "@/boot/axios";

export default function useTaxonomy(options) {
    const taxonomies = ref(options?.taxonomies || {})
    const termViewers = ref(options?.termViewers || {})
    const termEditors = ref(options?.termEditors || {})
    const taxonomyViewers = ref(options?.taxonomyViewers || {})
    const taxonomyEditors = ref(options?.taxonomyEditors || {})
    const defaultTermViewer = ref(options?.defaultTermViewer || null)
    const defaultTermEditor = ref(options?.defaultTermEditor || null)
    const defaultTaxonomyViewer = ref(options?.defaultTaxonomyViewer || null)
    const defaultTaxonomyEditor = ref(options?.defaultTaxonomyEditor || null)
    const taxonomiesUrl = ref(options?.taxonomiesUrl || '/2.0/taxonomies/')
    // eslint-disable-next-line no-unused-vars
    const taxonomyPermissions = ref(options?.taxonomyPermissions || function (taxonomy) {
        return [
            'edit'
        ]
    })
    // eslint-disable-next-line no-unused-vars
    const termPermissions = ref(options?.termPermissions || function (taxonomy, term) {
        return [
            'edit',
            'delete',
            'insert'
        ]
    })
    const titleGetter = ref(options?.taxonomyTitleGetter || function (taxonomy) {
        if (taxonomy.title) {
            return taxonomy.title
        }
        return taxonomy.code
    })

    const childrenOnly = (termArray) => {
        return termArray.filter(t => {
            return !t.is_ancestor
        })
    }

    function treeToRoot(termArray) {
        let map = {}, trees = [], i

        for (i = 0; i < termArray.length; i += 1) {
            map[termArray[i].links.self] = i
            termArray[i].parent = null
        }

        for (i = 0; i < termArray.length; i += 1) {
            const node = termArray[i]
            if (node.links.parent !== undefined) {
                termArray[map[node.links.parent]].parent = node
            } else {
                trees.push(node)
            }
        }
        return trees
    }

    function addTaxonomy(code, title, url) {
        taxonomies.value[code] = {
            code,
            title,
            links: {
                self: url,
                tree: url + '?drilldown=True'
            }
        }
    }

    async function loadTaxonomies() {
        return (await axios.get(`${taxonomiesUrl.value}?representation:include=dcn sta data`)).data.reduce((dict, x) => {
            dict[x.code] = x
            return dict
        }, {})
    }

    async function loadTaxonomy(code) {
        return (await axios.get(taxonomyUrl(code))).data
    }

    function taxonomyUrl(code) {
        return `${taxonomiesUrl.value}${code}`
    }

    async function loadTaxonomyPage({code, page, size, url, filter, levels, deleted}) {
        if (!url) {
            url = `${taxonomiesUrl.value}${code}?page=${page}&size=${size}&representation:include=dsc,anh,slug,dcn,drl,lvl,sta`
        } else {
            url = `${url}?page=${page}&size=${size}&representation:include=dsc,anh,slug,dcn,drl,lvl,sta`
        }
        if (deleted) {
            url = `${url},del`
        }
        if (levels && !filter) {
            url = `${url}&representation:levels=${levels}`
        }
        if (filter) {
            url = `${url}&q=${encodeURIComponent(filter)}`
        }
        const ret = await axios.get(url)
        return {
            terms: ret.data,
            total: ret.headers['x-total']
        }
    }

    async function loadTaxonomyTermElasticsearch(url) {
        const ret = (await axios.get(`${url}?representation:include=anl,ant,par`)).data
        return ret
    }

    async function suggest({code, filter, size}) {
        const url = `${taxonomiesUrl.value}${code}?page=1&size=${size || 20}&representation:include=dsc,anc,slug,dcn,drl,lvl&q=${encodeURIComponent(filter)}`
        const ret = await axios.get(url)
        return ret.data.children || []
    }

    async function addChild({term = undefined, url = undefined, child}) {
        if (!url) {
            url = `${term.links.self}?representation:include=dsc,slug,dcn,drl,lvl`
        } else {
            if (url.indexOf('?') >= 0) {
                url += '&'
            } else {
                url += '?'
            }
            url += 'representation:include=dsc,slug,dcn,drl,lvl'
        }
        const ret = await axios.post(url, child, {
            headers: {
                'If-None-Match': '*'
            },
            validateStatus: function (status) {
                return status >= 200 && status < 300
            }
        })
        return ret.data
    }

    async function move({term, destination}) {
        const url = term.links.self
        return (await axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/vnd.move',
                Destination: destination.links.self
            }
        })).data
    }

    function addViewer(code, viewer) {
        termViewers.value[code] = viewer
    }

    function addEditor(code, editor) {
        termEditors.value[code] = editor
    }

    function addTaxonomyViewer(code, viewer) {
        taxonomyViewers.value[code] = viewer
    }

    function addTaxonomyEditor(code, editor) {
        taxonomyEditors.value[code] = editor
    }

    return {
        addChild,
        addTaxonomyViewer,
        addTaxonomyEditor,
        addTaxonomy,
        addEditor,
        addViewer,
        move,
        suggest,
        loadTaxonomy,
        loadTaxonomies,
        loadTaxonomyPage,
        loadTaxonomyTermElasticsearch,
        titleGetter,
        termPermissions,
        taxonomyPermissions,
        defaultTaxonomyEditor,
        defaultTaxonomyViewer,
        defaultTermEditor,
        defaultTermViewer,
        childrenOnly,
        treeToRoot,
        taxonomyUrl
    }
}
