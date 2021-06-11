import './styles/quasar.sass'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import {
    AddressbarColor,
    BottomSheet,
    Cookies,
    Dialog,
    Loading,
    LoadingBar,
    Meta,
    Notify,
    QBadge,
    QBtn,
    QCheckbox,
    QChip,
    QExpansionItem,
    QItem,
    QItemSection,
    QList,
    QTab,
    QTabs,
    QTooltip
} from 'quasar'

export default {
    config: {
        brand: {
            primary: '#0068a2',
            secondary: '#5a5a5a',
            accent: '#a70057',

            dark: '#1D1D1D',

            positive: '#008547',
            negative: '#E60000',
            info: '#00A1DE',
            warning: '#FBB731'
        }
    },
    components: [
        QExpansionItem, QList, QItem,
        QItemSection, QBadge, QCheckbox,
        QTabs, QTab, QBtn, QChip, QTooltip
    ],
    plugins: {
        AddressbarColor,
        Cookies,
        BottomSheet,
        Loading,
        LoadingBar,
        Meta,
        Dialog,
        Notify
    }
}
