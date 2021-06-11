export default {
    props: {
        rules: Array
    },
    methods: {
        validate () {
            return this.$refs.input.validate()
        }
    },
    computed: {
        hasError () {
            return this.$refs.input.hasError
        }
    }
}
