import { scroll } from 'quasar'
const { setVerticalScrollPosition } = scroll

export default function useScroll() {
    const scrollToTop = () => {
        setVerticalScrollPosition(window, 0, 100)
    }

    return {scrollToTop}
}
