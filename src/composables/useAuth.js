import {usePopupLogin} from "@oarepo/vue-popup-login";
import {computed, ref} from "vue";
import useGDPR from '@/composables/useGDPR'


export default function useAuth() {
    const {state, login, logout} = usePopupLogin()
    const {showGdprPrompt} = useGDPR()

    const authenticating = ref(false)

    const authenticated = computed(() => {
        return state.value.loggedIn
    })

    const currentUser = computed(() => {
        if (state.value) {
            return state.value.user
        }
        return null
    })

    const currentUserRoles = computed(() => {
        if (currentUser.value) {
            return currentUser.value.roles
        }
        return []
    })

    const currentUserInfo = computed(() => {
        if (state.value) {
            return state.value.userInfo
        }
        return null
    })

    const currentUserName = computed(() => {
        if (state.value) {
            const cui = currentUserInfo.value
            if (cui.givenName && cui.familyName)
            return `${cui.givenName} ${cui.familyName}` || currentUser.value?.email
        }
        return ''
    })

    function hasRole(role) {
        if (currentUserRoles.value.find(rol => rol.id === role)) {
            return true
        }
        return false
    }

    async function doLogin() {
        authenticating.value = true
        showGdprPrompt()
            .then(() => {
                login()
            })
            .catch(() => {
            })
            .finally(() => {
                authenticating.value = false
            })
    }

    function doLogout() {
        // TODO: update when https://github.com/oarepo/vue-popup-login/issues/170 resolved
        // redirect to route {name: 'logged-out'}
        logout()
    }

    return {
        state,
        authenticated,
        authenticating,
        currentUser,
        currentUserInfo,
        currentUserRoles,
        currentUserName,
        hasRole,
        doLogin,
        doLogout
    }
}
