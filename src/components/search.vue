<template>
  <div v-show="showSearchPage" id="search-page">
    <div id="search-page-top">
      <div>
        <input id="" v-model="inputSeachword" type="text" name="seachword">
        <van-button
          type="primary"
          size="small"
          @click="search(inputSeachword)"
        >搜索</van-button>
      </div>
      <van-icon name="close" color="#66ccff" size="30" @click="()=> {this.showSearchPage = !this.showSearchPage}" />
    </div>
    <div>
      <van-collapse v-model="activeNames">
        <van-collapse-item
          v-for="(item, index) in showResult"
          :key="index"
          class="origin-list"
          :title="item.webName"
          name="1"
        >
          <van-cell-group :style="{textAlign: 'left'}">
            <div
              v-for="(item2, index2) in item.findres"
              :key="index2"
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
      showSearchPage: true,
      inputSeachword: '恋爱',
      activeNames: ['1'],
      searcKey: '',
      searchInfo: [],
      showResult: [],

      findres: [
        {
          'webName': '腾讯漫画',
          'findres': [
            {
              'name': '航海王',
              'url': 'https://ac.qq.com//Comic/comicInfo/id/505430',
              'imageUrl': 'https://manhua.acimg.cn/vertical/0/17_16_48_0e28c8aabf48e91d395689b5f6a7689f.jpg/420'
            }
          ]
        }
      ]
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
          // const blob = await request('get', element.imageUrl, 'blob')
          const blob = await request({
            method: 'get',
            url: element.imageUrl,
            responseType: 'blob',
            timeout: 3000 })
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
      }
      this.showResult = []
      for (let i = 0; i < comicsWebInfo.length; i++) {
        const item = comicsWebInfo[i]
        if (item.searchFun) {
          try {
            const findres = await item.searchFun(keyword)
            let showLen
            findres.length > 6 ? showLen = 6 : showLen = findres.length
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
  width: 1000px;
  height: 500px;
  position: fixed;
  top: 50%;
  left: 30%;
  transform: translate(-50%,-50%);
  border: 1px solid @yiColor;
  background-color: #fff;
  z-index: 9999999;

  #search-page-top {
    display: flex;
  }

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
    border: 1px solid @lingColor;
  }

}
</style>
