import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    counter: 1,
  }),
  actions: {
    reset() {
      this.counter = 3
    },
  },
})
