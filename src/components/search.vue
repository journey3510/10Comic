<template>
  <div v-show="showSearchPage" id="search-page">
    <div id="search-page-top">
      <van-sticky>

        <div class="search-input-btn">
          <van-loading v-show="showSearchLoad" color="#ee0000" type="spinner" size="25" />
          <input v-model="inputSeachword" type="text" name="searchword" @keyup.enter="search(inputSeachword)">
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
      <div v-show="showResult.length !== 0">

        <van-collapse v-model="activeNames">
          <van-collapse-item
            v-for="(item, index) in showResult"
            :key="index"
            class="origin-list"
            :title="item.webName"
            :name="index"
          >
            <van-cell-group :style="{textAlign: 'left',background: 'rgb(245 245 245 / 33%)', padding: '2px 0'}">
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
                  @error="loadImgError(item2, item.webName)"
                >
                  <template v-slot:loading>
                    <van-loading type="spinner" size="25" />
                  </template>
                </van-image>
                <p>{{ item2.name }}</p>
              </div>
            </van-cell-group>
          </van-collapse-item>
        </van-collapse>
      </div>

      <van-empty v-show="showResult.length === 0" description="搜索内容" />

    </div>
  </div>

</template>

<script>

import { request } from '@/utils/index'
import { comicsWebInfo, searchFunTemplate_1 } from '@/utils/comics'

import { Toast } from 'vant'

export default {
  name: 'SearchPage',
  data() {
    return {
      showSearchPage: false,
      inputSeachword: '',
      showSearchLoad: false,
      searchTime: 0,
      activeNames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      searcKey: '',
      searchInfo: [],
      showResult: [],
      showSearchPart: false
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
    async loadImgError(item, name) {
      const url = item.imageUrl
      item.imgErrorTime === undefined ? item.imgErrorTime = 0 : ''

      if (item.imgErrorTime !== 1) {
        const blob = await request({
          method: 'get',
          url,
          responseType: 'blob',
          timeout: 10000 })
        const newUrl = window.URL.createObjectURL(blob.response)
        item.imgErrorTime++
        item.imageUrl = newUrl
      }
    },
    getSearchContent(len) {
      const oneWebInfo = this.searchInfo[len - 1]
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
      this.searchTime++
      const currentSearchTime = this.searchTime
      this.showSearchLoad = true
      this.showResult = []
      for (let i = 0; i < comicsWebInfo.length; i++) {
        const item = comicsWebInfo[i]
        if (!item.searchTemplate_1 && !item.searchFun) {
          continue
        }

        let findres = []
        if (item.searchTemplate_1) {
          try {
            findres = await searchFunTemplate_1(item, keyword)
          } catch (error) {
            Toast({
              message: item.webName + '\n' + error,
              getContainer: '#search-page',
              position: 'center'
            })
          }
        }

        if (!item.searchTemplate_1 && item.searchFun) {
          try {
            findres = await item.searchFun(keyword)
          } catch (error) {
            Toast({
              message: item.webName + '\n' + error,
              getContainer: '#search-page',
              position: 'center'
            })
          }
        }

        if (currentSearchTime === this.searchTime) {
          let showLen
          findres.length > 8 ? showLen = 8 : showLen = findres.length
          this.searchInfo.push({
            webName: item.webName,
            findres: findres.slice(0, showLen)
          })
        }
      }
      this.showSearchLoad = false
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
    border-bottom: 1px solid @yiColor;

    .search-input-btn {
      margin-left: 400px;
      margin-top: 10px;
      width: 320px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      input {
        border: 1px solid @yiColor;
        height: 20px;
        width: 200px;
        border-radius: 5px;
        background: #fff;
        font-size: 15px;
        line-height: 20px;
        padding-left: 15px;
      }

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
