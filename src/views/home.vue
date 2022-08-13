<template>
  <div class="homeindex">
    <div
      id="selectId"
      :style="{width: '200px',position: 'relative',margin:'-5px 0 2px 15px',zIndex: 999999}"
      @mouseleave="leaveCollapse"
    >
      <van-collapse v-model="activeNames">
        <van-collapse-item class="xxx" :title="checkTitle" name="1">
          <div @click="checkContent(1, '原漫画列表')">原漫画列表</div>
          <br>
          <div @click="checkContent(2, '导入列表')">导入列表</div>
        </van-collapse-item>
      </van-collapse>
    </div>

    <van-cell-group v-if="checkValue == 1" inset>
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

    <div v-if="checkValue == 2">
      <van-cell-group inset>
        <van-cell
          v-for="(item, index) in userWebInfo"
          :key="index"
          is-link
          @click="jump(item.homepage)"
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
    </div>
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
      checkValue: 1,
      checkTitle: '原漫画列表'

    }
  },
  mounted() {
    this.getWeb()
  },
  methods: {
    async getWeb() {
      this.comicList = (await getWebList()).list
      this.userWebInfo = (await getWebList()).userWebInfo
      // console.log('this.userWebInfo : ', this.userWebInfo)
    },
    checkContent(val, title) {
      this.checkValue = val
      this.checkTitle = title
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

<style lang="less" scoped>
.homeindex {
  margin-top: 12px;
  overflow-y: auto;
  max-height: 675px;
  min-height: 600px;
  #selectId {
    margin-top: 10px;
    /deep/ .van-collapse-item__wrapper{
      position: absolute;
      width: 100%;
      .van-collapse-item__content {
        background-color: #eeeeee !important;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
      }

      .van-collapse-item__content div:hover {
        color: red;
      }
    }
  }

}
</style>
