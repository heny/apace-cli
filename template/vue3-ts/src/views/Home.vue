<template>
  <div class="box">
    123：
    <h1>Pinia: {{ counter }}</h1>
  </div>
</template>
<script lang="ts" setup>
import { useMainStore } from '@/store/main'
import { getData } from '@/api/demo'

onMounted(() => {
  getData().then((res) => {
    console.log(res, 'res')
  })
})

const main = useMainStore()
const { counter } = storeToRefs(main)
console.log(counter.value, 'counter')
</script>
<style lang="scss">
.box {
  color: red;
}
</style>
