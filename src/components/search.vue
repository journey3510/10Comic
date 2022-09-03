<template>
  <div v-show="showSearchPage" id="search-page">
    <div id="search-page-top">
      <van-sticky>

        <div class="search-input-btn">
          <input v-model="inputSeachword" type="text" name="searchword">
          <van-button
            type="primary"
            size="small"
            @click="search(inputSeachword)"
          >搜索</van-button>
        </div>
      </van-sticky>

      <van-icon
        id="close-search-btn"
        name="close"
        color="#66ccff"
        @click="()=> {this.showSearchPage = !this.showSearchPage}"
      />
    </div>

    <div id="search-page-bottom">
      <van-collapse v-model="activeNames">
        <van-collapse-item
          v-for="(item, index) in showResult"
          :key="index"
          class="origin-list"
          :title="item.webName"
          :name="index"
        >
          <van-cell-group :style="{textAlign: 'left',background: '#eee5', padding: '2px 0'}">
            <div
              v-for="(item2, index2) in item.findres"
              :key="index2"
              :title="item2.url"
              class="origin-image-list"
              @click="toResultWeb(item2.url)"
            >
              <van-image
                width="100"
                height="150"
                :src="item2.imageUrl"
              />
              <p>{{ item2.name }}</p>
            </div>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </div>

  </div>
</template>

<script>

import { request } from '@/utils/index'
import { comicsWebInfo } from '@/utils/comics'

import { Toast } from 'vant'

export default {
  name: 'SearchPage',
  data() {
    return {
      showSearchPage: false,
      inputSeachword: '',
      activeNames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      searcKey: '',
      searchInfo: [],
      showResult: []
    }
  },
  watch: {
    'searchInfo.length': {
      handler(newLen, oldLen) {
        if (newLen !== oldLen) {
          this.getSearchContent(newLen)
        }
      }
    }
  },
  mounted() {
    this.$bus.$on('showSearchPage', () => { this.showSearchPage = !this.showSearchPage })
  },
  methods: {
    toResultWeb(url) {
      window.open(url, '_blank')
    },
    async getSearchContent(len) {
      const oneWebInfo = this.searchInfo[len - 1]
      const list = oneWebInfo.findres

      for (let i = 0; i < list.length; i++) {
        const element = list[i]
        // 利用油猴来请求 图片
        try {
          const blob = await request({
            method: 'get',
            url: element.imageUrl,
            responseType: 'blob',
            timeout: 1000 })
          const url = window.URL.createObjectURL(blob.response)
          element.imageUrl = url
        // eslint-disable-next-line no-empty
        } catch (error) {}
      }
      this.showResult.push(oneWebInfo)
    },
    async search(keyword) {
      if (keyword.length < 2) {
        Toast({
          message: '至少2个字符',
          getContainer: '#search-page',
          position: 'center'
        })
        return
      }
      this.showResult = []
      for (let i = 0; i < comicsWebInfo.length; i++) {
        const item = comicsWebInfo[i]
        if (item.searchFun) {
          try {
            const findres = await item.searchFun(keyword)
            let showLen
            findres.length > 8 ? showLen = 8 : showLen = findres.length
            this.searchInfo.push({
              webName: item.webName,
              findres: findres.slice(0, showLen)
            })
            // eslint-disable-next-line no-empty
          } catch (error) {}
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
#search-page {
  width: 1100px;
  height: 600px;
  max-height: 600px;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 40%;
  transform: translate(-50%,-50%);
  border: 1px solid #ee000066;
  border-radius: 15px;
  box-shadow: 2px 4px 4px 2px #ee000022;

  background-color: #fff;
  z-index: 9999999;

  #search-page-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;

    input {
      border: 1px solid @yiColor;
      height: 20px;
      width: 200px;
      border-radius: 5px;
      background: #fff;
    }
    .search-input-btn {
      margin-left: 300px;
      margin-top: 10px;
      width: 280px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      /deep/ .van-button--small {
        height: 25px;
      }
    }

    #close-search-btn {
      color: @yiColor;
      display: flex;
      margin-top: 2px;
      font-size: 40px;
      height: 40px;
      background-color: #fff;
      border-radius: 20px;
      margin-top: 5px;
      margin-right: 5px;
    }
    #close-search-btn:hover {
      color: red;
      transform: rotate(180deg);
      transition: all 1s;
    }
  }

  #search-page-bottom {
    height: 530px;
    max-height: 530px;
    overflow-y: scroll;
    .origin-image-list {
      display: flex;
      width: 120px;
      flex-direction: row;
      display: inline-block;
      text-align: center;
      cursor: pointer;
      margin: 2px;
      padding: 1px;
      p {
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .origin-image-list:hover {
      border: 2px solid @yiColor;
    }
  }

}
</style>
