<template>
    <div>
        Card
        <div v-if="loading">loading card...</div>
        <div v-else>cid: {{cid}}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cid: 0,
            loading: false
        }
    },
    watch: {
        "$route": {
            handler: 'fetchData',   // this.fetchData()
            immediate: true         // 변경될때 외에 처음 created() 될때도 1회 실행됨 -> created()를 대체한다
            //this.cid = this.$route.params.cid
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            setTimeout(() => {
                this.cid = this.$route.params.cid
                this.loading = false
            }, 500);
        }
    }
}
</script>

<style>
</style>