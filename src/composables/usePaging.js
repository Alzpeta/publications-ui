import {computed} from 'vue'
import {useQuery} from '@oarepo/vue-query-synchronizer'

export default function usePaging(collection) {
    const query = useQuery()

    const pages = computed(() => {
        const ret = []
        let paginationStart = Math.max(1, collection.page - 10);
        let paginationEnd = Math.min(collection.pages, paginationStart + 20);
        for (let i = paginationStart; i < paginationEnd; i++) {
            ret.push(i)
        }
        return ret
    })

    function setPage(page) {
        query.page = page
    }

    return {pages, setPage}
}
