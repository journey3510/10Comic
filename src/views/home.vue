<template>
  <div class="homeindex">
    <van-cell-group inset>
      <van-cell
        v-for="(item, index) in comicList"
        :key="index"
        :title="item.name"
        is-link
        @click="jump(item.url)"
      />
    </van-cell-group>
  </div>
</template>

<script>

import { getWebList } from '@/utils/comics'

export default {
  name: 'Index',
  data() {
    return {
      comicList: []
    }
  },
  mounted() {
    this.comicList = getWebList()
  },
  methods: {
    jump(url) {
      window.open(url, '_blank')
      // window.location.href = url
    }
  }
}
</script>

<style lang="scss" scoped>
.homeindex {
  margin-top: 20px;
}
</style>
