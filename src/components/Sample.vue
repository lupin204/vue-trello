<template>
  <div>This is Sample Page</div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      test: 'test'
    }),
    ...mapGetters([
      'TEST'
    ]),
  },
  methods: {
    ...mapMutations([
      'SET_TEST'
    ]),
    ...mapActions([
      'FETCH_TEST'
    ])
  }
};
</script>

<style>
</style>