<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div class="homeindex">
    <div
      id="selectId"
      :style="{position: 'relative',margin:'-5px 0 2px 15px',zIndex: 999999}"
      @mouseleave="leaveCollapse"
    >
      <van-collapse v-model="activeNames" style="width: 200px;">
        <van-collapse-item class="xxx" :title="checkTitle" name="1">
          <div @click="checkContent(1, '原列表')">原列表</div>
          <br>
          <div @click="checkContent(2, '导入规则列表')">导入规则列表</div>
        </van-collapse-item>
      </van-collapse>

      <van-icon id="search-ico" name="search" size="30" color="#ee0000" @click="()=>{ this.$bus.$emit('showSearchPage')}" />
    </div>

    <van-cell-group v-if="checkValue == 1" inset>
      <van-cell
        v-for="(item, index) in originalInfo"
        v-if="!item.showInList"
        :key="index"
        is-link
        @click="jump(item.homepage)"
      >
        <template #title>
          <span>{{ item.webName }}</span>
          <van-icon
            v-if="item.webDesc"
            :title="item.webDesc"
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
              v-if="item.webDesc"
              :title="item.webDesc"
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
      originalInfo: [],
      userWebInfo: [],
      //
      activeNames: [1],
      checkValue: 1,
      checkTitle: '原列表'

    }
  },
  created() {
    this.getWeb()
  },
  mounted() {
    this.$bus.$on('getWeb', this.getWeb)
  },
  methods: {
    getWeb() {
      const { originalInfo, userWebInfo } = getWebList()
      this.originalInfo = originalInfo
      this.userWebInfo = userWebInfo
    },
    checkContent(val, title) {
      this.checkValue = val
      this.checkTitle = title
      this.activeNames = []
    },
    leaveCollapse() {
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
    // margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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

    #search-ico {
      cursor: pointer;
      color: @lingColor;
      margin-right: 15px;

    }
  }

}
</style>
