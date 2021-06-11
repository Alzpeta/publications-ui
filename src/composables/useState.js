import {computed} from 'vue'
import {STATE_APPROVED, STATE_EDITING, STATE_PENDING_APPROVAL, STATE_PUBLISHED} from "@/constants";

export default function useState(metadata) {
    const isDraft = computed(() => {
        return metadata['oarepo:draft']
    })

    const isApproved = computed(() => {
        return !isDraft.value && metadata.state === STATE_APPROVED
    })

    const isEdited = computed(() => {
        return isDraft.value && (metadata.state === STATE_EDITING || !metadata.state)
    })

    const isPendingApproval = computed(() => {
        return isDraft.value && metadata.state === STATE_PENDING_APPROVAL
    })

    const isPublic = computed(() => {
        return metadata.state === STATE_PUBLISHED
    })

    return {isDraft, isApproved, isEdited, isPublic, isPendingApproval}
}
