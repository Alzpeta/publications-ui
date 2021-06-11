export default {
    path: 'form',
    component: () => import(/* webpackChunkName: 'layouts' */ '@/layouts/FormLayout'),
    meta: {
        authorization: {}
    },
    children: [
        {
            // CREATE record in ANY community (user can choose in component)
            path: `:model/create`,
            name: 'create',
            component: () => import(/* webpackChunkName: 'forms' */ '@/pages/forms/CreateForm'),
            meta: { useFacets: false }
        },
        {
            // CREATE record in CURRENT community
            path: ':communityId/:model/create',
            name: 'community-create',
            component: () => import(/* webpackChunkName: 'forms' */ '@/pages/forms/CreateForm'),
            meta: { useFacets: false }
        }
    ]
}
