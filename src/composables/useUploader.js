import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

import Uppy from '@uppy/core'
import AwsS3Multipart from '@uppy/aws-s3-multipart'
import {onBeforeUnmount, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {axios} from '@/boot/axios'

export default function useUploader(url) {
    const {locale} = useI18n()
    let langPack = null
    if (locale.value === 'cs' || locale.value === 'cs-CZ') {
        langPack = require('@uppy/locales/lib/cs_CZ')
    }
    if (locale.value === 'en' || locale.value === 'en-US') {
        langPack = require('@uppy/locales/lib/en_US')
    }

    function createMultipartUpload(file) {
        const metadata = {}

        Object.keys(file.meta).map(key => {
            if (file.meta[key] != null) {
                metadata[key] = file.meta[key].toString()
            }
        })

        return axios.post(`${url}?multipart=true`, {
            key: file.name,
            size: file.size,
            multipart_content_type: file.type,
            ...metadata
        }).then((res) => {
            if (res && res.error) {
                const error = new Error(res.message)
                Object.assign(error, res.error)
                throw error
            }
            return {uploadId: res.data.uploadId, key: res.data.key}
        })
    }

    // eslint-disable-next-line no-unused-vars
    function prepareUploadPart(file, {key, uploadId, number}) {
        const filename = encodeURIComponent(file.name)
        return axios.get(`${url}/${filename}/${uploadId}/${number}/presigned`)
            .then((res) => {
                if (res && res.error) {
                    const error = new Error(res.message)
                    Object.assign(error, res.error)
                    throw error
                }
                return {url: res.data.url}
            })
    }

    // eslint-disable-next-line no-unused-vars
    function completeMultipartUpload(file, {key, uploadId, parts}) {
        const filename = encodeURIComponent(file.name)
        const uploadIdEnc = encodeURIComponent(uploadId)
        return axios.post(`${url}/${filename}/${uploadIdEnc}/complete`, {parts})
            .then((res) => {
                if (res && res.error) {
                    const error = new Error(res.message)
                    Object.assign(error, res.error)
                    throw error
                }
                return {location: `${res.data.location}?download`}
            })
    }

    // eslint-disable-next-line no-unused-vars
    function abortMultipartUpload (file, { key, uploadId }) {
        const filename = encodeURIComponent(file.name)
        const uploadIdEnc = encodeURIComponent(uploadId)
        return axios.delete(`${url}/${filename}/${uploadIdEnc}/abort`)
            .then((res) => {
                if (res && res.error) {
                    const error = new Error(res.message)
                    Object.assign(error, res.error)
                    throw error
                }
                return res.data
            })
    }

    // eslint-disable-next-line no-unused-vars
    function listParts (file, { key, uploadId }) {
        const filename = encodeURIComponent(file.name)
        const uploadIdEnc = encodeURIComponent(uploadId)
        return axios.get(`${url}/${filename}/${uploadIdEnc}/parts`)
            .then((res) => {
                console.log(res)
                if (res && res.error) {
                    const error = new Error(res.message)
                    Object.assign(error, res.error)
                    throw error
                }
                return res.data
            })
    }

    const uppy = ref(new Uppy({
        locale: langPack
    }))
    uppy.value.use(AwsS3Multipart, {
        limit: 4,
        createMultipartUpload: createMultipartUpload,
        prepareUploadPart: prepareUploadPart,
        abortMultipartUpload: abortMultipartUpload,
        completeMultipartUpload: completeMultipartUpload,
        listParts: listParts
    })

    onBeforeUnmount(() => {
        uppy.value.close()
    })

    return {uppy}
}
