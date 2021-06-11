import {computed, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {axios} from '@/boot/axios'
import {useRouter} from 'vue-router'
import useCollection from '@/composables/useCollection'
import {useContext} from 'vue-context-composition'
import {community} from '@/contexts/community'

export default function useFSM(record) {
    const {t} = useI18n()
    const $q = useQuasar()
    const router = useRouter()
    const {model} = useCollection()
    const {communityId} = useContext(community)

    const changingState = ref(false)

    const transitions = computed(() => {
        return Object.entries(record.http.data?.links?.transitions || {}).map(([code, url]) => ({
            url,
            code: code,
            label: t(`action.${code}`),
            actionLabel: t(`action.${code}`),
            icon: t(`icon.${code}`)
        }))
    })

    function makeTransition (transition) {
        $q.dialog({
            title: t('label.actionApprove'),
            message: `${t('message.doYRlyWnt')} ${transition.actionLabel}?`,
            cancel: true,
            persistent: true
        }).onOk(async () => {
            const validity = record?.metadata['oarepo:validity']?.valid
            if (validity !== false || ['request_changes', 'delete_draft'].includes(transition.code)) {
                _makeTransition(transition, false)
            } else {
                $q.dialog({
                    title: t('label.actionApprove'),
                    message: `${t('message.recordNotValid')}. ${t('message.doYRlyWnt')} ${transition.actionLabel}?`,
                    cancel: true,
                    persistent: true
                }).onOk(async () => {
                    _makeTransition(transition, true)
                })
            }
        })
    }

    async function _makeTransition (transition, force) {
        changingState.value = true
        try {
            await axios.post(transition.url, {
                force
            })
            if (transition.code === 'approve') {
                await router.replace({
                    name: 'published-detail',
                    params: {
                        communityId: communityId.value,
                        model: model.value,
                        recordId: this.record.id
                    }
                })
                return
            }
            if (transition.code === 'revert_approval') {
                await router.replace({
                    name: 'detail',
                    params: {
                        communityId: communityId.value,
                        model: model.value,
                        state: 'draft',
                        recordId: this.record.id
                    }
                })
                return
            }
            if (transition.code === 'delete_draft') {
                await router.replace({
                    name: 'list',
                    params: {
                        communityId: communityId,
                        model: model
                    }
                })
                $q.notify({
                    message: t('message.draftDeleted'),
                    color: 'accent',
                    icon: 'delete_sweep'
                })
                return
            }
            $q.notify({
                message: t('message.completeSuccess'),
                color: 'positive',
                icon: 'published_with_changes'
            })
        } catch (e) {
            console.log(e)
            $q.dialog({
                title: t('error.stateChangeFail'),
                message: `${t('error.stateChangeMessage')}: ${e} ${JSON.stringify(e.response.data)}`,
                cancel: false,
                persistent: true,
                icon: 'error'
            })
        }
        changingState.value = false
    }
    return {changingState, makeTransition, transitions}
}
