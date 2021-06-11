import {copyToClipboard} from 'quasar'
import useNotify from '@/composables/useNotify'

export default function useClipboard() {
    const {notifySuccess} = useNotify()

    function copy2clip(data) {
        copyToClipboard(JSON.stringify(data, null, 4))
            .then(() => {
                notifySuccess('message.copiedToClip')
            })
    }

    return {copy2clip}
}
