import {collection} from '@oarepo/invenio-vue'

export default {
    path: '',
    component: () => import(/* webpackChunkName: 'layouts' */ '@/layouts/ListLayout'),
    children: [
        collection({
            // ALL records in ALL communities
            path: `:model(datasets|articles)/:state(draft|all)/`,
            name: 'list',
            component: () => import(/* webpackChunkName: 'collections' */ '@/pages/collections/CollectionList')
        }, {
            meta: {
                query: { sort: 'string:alphabetical' },
                useFacets: true,
            }
        }),
        collection({
            // ALL records in SPECIFIC community
            path: ':communityId/:model(datasets|articles)/:state(draft|all)/',
            name: 'community-list',
            component: () => import(/* webpackChunkName: 'collections' */ '@/pages/collections/CollectionList')
        }, {
            meta: {
                query: { sort: 'string:alphabetical' },
                useFacets: true,
            }
        })
    ]
}
