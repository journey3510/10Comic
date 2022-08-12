<template>
  <div class="homeindex">
    <div
      id="selectId"
      :style="{width: '200px',position: 'relative',margin:'-10px 0 0 13px',zIndex: 999999}"
      @mouseleave="leaveCollapse"
    >
      <van-collapse v-model="activeNames">
        <van-collapse-item class="xxx" :title="checkTitle" name="1">
          <div @click="checkContent(1)">dddd</div>
          <div>dddd</div>
          <div>dddd</div>
        </van-collapse-item>
      </van-collapse>
    </div>

    <!-- <div>
      <van-cell-group inset>
        <van-cell
          v-for="(item, index) in userWebInfo"
          :key="index"
          is-link
          @click="jump(item.url)"
        >
          <template #title>
            <span>{{ item.webName }}</span>
            <van-icon
              v-if="item.iswork === false"
              title="？可访问 ？"
              name="info-o"
              color="red"
            />
          </template>
        </van-cell>
      </van-cell-group>
    </div> -->

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
      userWebInfo: [],
      //
      activeNames: [1],
      checkTitle: 'sss'

    }
  },
  mounted() {
    this.getWeb()
  },
  methods: {
    async getWeb() {
      this.comicList = (await getWebList()).list
      this.userWebInfo = (await getWebList()).userWebInfo
      console.log('this.userWebInfo : ', this.userWebInfo)
    },
    checkContent(val) {
      this.checkTitle = val
      this.activeNames = []
    },
    leaveCollapse() {
      console.log(111)
      this.activeNames = []
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
  min-height: 600px;
  #selectId {
     >>> .van-collapse-item__wrapper{
      border: 1px solid red !important;
      border-right: 1px solid red;
      border-bottom: 1px solid red;
      border-radius: 5px;
      .van-collapse-item__content div:hover {
          background-color: red;
      }
    }
  }

}
</style>
