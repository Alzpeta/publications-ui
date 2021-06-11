export function useTranslated(locale) {
    const mt = (multilang) => {
        if (!multilang) {
            return undefined
        }
        if (multilang[locale.value]) {
            return multilang[locale.value]
        }
        if (multilang['cs']) {
            return multilang['cs']
        }
        for (const k of Object.keys(multilang)) {
            if (typeof multilang[k] === 'string') {
                return multilang[k]
            }
        }
    }

    return {mt}
}
