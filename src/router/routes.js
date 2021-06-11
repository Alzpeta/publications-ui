// import admin from './admin'
// import articles from '@/router/articles'
import collections from '@/router/collections'
import forms from '@/router/forms'
import records from '@/router/records'

// Route map (route matched from top to bottom)
//
// / homepage
// /
// /:model/create create
// /:communityId/:model/create community-create
// /:model/:state/ list
// /:communityId/:model/:state/ community-list
// /logged-out logged-out
// /:pathMatch(.*)* not-found
// /:catchAll(.*)*
//

const routes = [
    { /* Homepage routes */
        path: '/',
        component: () => import(/* webpackChunkName: 'homepage' */ '@/layouts/LandingLayout'),
        children: [
            {
                name: 'homepage',
                path: '',
                component: () => import(/* webpackChunkName: 'homepage' */ '@/pages/Homepage')
            },
            // admin,
        ]
    },
    { /* Record collection routes */
        path: '/',
        component: () => import(/* webpackChunkName: 'layouts' */ '@/layouts/WrapperLayout'),
        children: [
            {
                path: '',
                component: () => import(/* webpackChunkName: 'layouts' */ '@/layouts/FormLayout'),
                children: [{
                    // Record Edit route
                    path: ':communityId/:model/draft/:recordId/edit',
                    name: 'edit',
                    component: () => import(/* webpackChunkName: 'forms' */ '@/pages/forms/EditForm'),
                    meta: {useFacets: false}
                }]
            },
            records,
            forms,
            collections,
            { /* Other routes */
                path: 'logged-out',
                name: 'logged-out',
                component: () => import(/* webpackChunkName: 'auth' */ '@/pages/auth/LoggedOut.vue')
            },
            {
                path: ':pathMatch(.*)*',
                name: 'not-found',
                component: () => import(/* webpackChunkName: 'errors' */ '@/pages/errors/Error404.vue')
            },
            // Always leave this as last one,
            // but you can also remove it
            {
                path: ':catchAll(.*)*',
                component: () => import(/* webpackChunkName: 'errors' */ '@/pages/errors/Error404.vue')
            }
        ]
    }
]

export default routes
