import {Cookies, openURL, useQuasar} from 'quasar'
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'

const
    TOS = 'https://du.cesnet.cz/en/provozni_pravidla/start',
    PRIVACY_POLICY = 'https://www.cesnet.cz/cesnet/personal-data-protection/?lang=en'

export default function useGDPR() {
    const $q = useQuasar()
    const { t } = useI18n()

    const gdprAccepted = computed(() => {
        return Cookies.has('gdpr') === true
    })

    function showGdprPrompt () {
        return new Promise((resolve, reject) => {
            if (gdprAccepted.value) {
                resolve()
                return
            }
            $q.bottomSheet({
                title: t('section.gdpr'),
                message: t('message.gdprPrompt'),
                dark: true,
                persistent: true,
                icon: 'policy',
                actions: [
                    {
                        id: 'tos',
                        label: t('action.openTOS'),
                        size: 'sm',
                        icon: 'launch',
                        noDismiss: true,
                        color: 'grey-3'
                    },
                    {
                        id: 'privacy',
                        label: t('action.openPrivacyPolicy'),
                        size: 'sm',
                        icon: 'launch',
                        noDismiss: true,
                        color: 'grey-3'
                    },
                    {
                        id: 'accept',
                        icon: 'check',
                        label: t('action.accept'),
                        color: 'yellow'
                    },
                    {
                        id: 'decline',
                        icon: 'close',
                        label: t('action.decline'),
                        color: 'red'
                    }
                ]
            }).onOk((action) => {
                switch (action.id) {
                    case 'accept':
                        Cookies.set('gdpr', 'true', { expires: 5 * 365 })
                        resolve()
                        break
                    case 'decline':
                        reject()
                        break
                    case 'tos':
                        openURL(TOS)
                        break
                    case 'privacy':
                        openURL(PRIVACY_POLICY)
                        break
                }
            }).onCancel(() => reject())
                .onDismiss(() => reject())
        })
    }

    return { gdprAccepted, showGdprPrompt }
}
