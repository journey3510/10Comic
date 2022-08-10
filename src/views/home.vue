<template>
  <div class="homeindex">
    <van-cell-group inset>
      <van-cell
        v-for="(item, index) in userWebInfo"
        :key="index"
        is-link
        @click="jump(item.url)"
      >
        <template #title>
          <span>{{ item.name }}</span>
          <van-icon
            v-if="item.iswork === false"
            title="？可访问 ？"
            name="info-o"
            color="red"
          />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset>
      <van-cell
        v-for="(item, index) in comicList"
        :key="index"
        is-link
        @click="jump(item.url)"
      >
        <template #title>
          <span>{{ item.name }}</span>
          <van-icon
            v-if="item.iswork === false"
            title="？可访问 ？"
            name="info-o"
            color="red"
          />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>

import { getWebList } from '@/utils/comics'

export default {
  name: 'Index',
  data() {
    return {
      comicList: [],
      userWebInfo: []
    }
  },
  mounted() {
    this.getWeb()
  },
  methods: {
    async getWeb() {
      this.comicList = (await getWebList()).list
      this.userWebInfo = (await getWebList()).userWebInfo
    },
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
  overflow-y: auto;
  max-height: 675px;
}
</style>
