import {record} from '@oarepo/invenio-vue'

export default {
    path: '',
    component: () => import(/* webpackChunkName: 'layouts' */ '@/layouts/RecordLayout'),
    children: [
        record({
            // Published Record Detail route
            path: ':communityId/:model(datasets|articles)/:recordId',
            name: 'published-detail',
            component: () => import(/* webpackChunkName: 'collections' */ '@/pages/records/RecordDetail')
        }, {
            meta: {
                useFacets: false,
                useRecordActions: true
            }
        }),
        record({
            // Record Detail route
            path: ':communityId/:model(datasets|articles)/draft/:recordId',
            name: 'detail',
            component: () => import(/* webpackChunkName: 'collections' */ '@/pages/records/RecordDetail'),
        }, {
            meta: {
                useFacets: false,
                useRecordActions: true
            }
        })
    ]
}
