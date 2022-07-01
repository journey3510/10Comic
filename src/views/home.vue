<template>
  <div class="homeindex">
    <van-cell-group inset>
      <van-cell
        v-for="(item, index) in comicList"
        :key="index"
        title="单元格"
      />
      <!-- is-link
        url="/vant/mobile.html" -->
    </van-cell-group>
  </div>
</template>

<script>

export default {
  name: 'Index',
  data() {
    return {
      q: 0,
      comicList: [1, 1, 1, 1]
    }
  }
}
</script>

<style lang="scss" scoped>
.homeindex {
  margin-top: 20px;
}
</style>
