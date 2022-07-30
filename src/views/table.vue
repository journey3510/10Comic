<template>
  <div id="comiclist">
    <!-- 编辑选项 -->
    <div id="editItem">
      <div>
        <van-button
          type="primary"
          size="mini"
          :disabled="!showSelectList"
          @click="selectAll"
        >全选</van-button>
        <van-button
          type="primary"
          size="mini"
          :disabled="!showSelectList"
          @click="CancelSelect"
        >取消</van-button>
      </div>

      <van-button
        style="width:80px;"
        size="mini"
        round
        type="primary"
        :disabled="!showSelectList"
        @click="downSelectList"
      >下载</van-button>
    </div>

    <van-divider
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 15px',height: '10px' }"
    >
      <code style="cursor: pointer" @click="reloadList">重载列表</code>
    </van-divider>

    <!-- 列表为空 -->
    <div v-if="!showSelectList">
      <van-empty description="漫画章节">
        <van-button
          style="width:120px;"
          round
          type="primary"
          class="bottom-button"
          :disabled="comicName === '------'"
          @click="getSelectList"
        > 加载 </van-button>

      </van-empty>

      <van-cell-group id="comicinfo" inset>
        <van-cell title="网站" :value="webname" />
        <van-cell title="漫画" :value="comicName" />
      </van-cell-group>

    </div>

    <van-overlay id="overlayDom" :show="overlayShow" />

    <!-- 展示列表 -->
    <div
      v-if="showSelectList"
      id="select-list"
    >

      <van-cell-group
        style="border-radius: 25px;"
        inset
      >
        <van-checkbox-group ref="checkboxGroup" v-model="selectResult">
          <van-cell
            v-for="(item,index) in list"
            :key="index"
            :style="item.url !== 'javascript:void();' ?'': {color: 'red'}"
            :title="item.chapterName"
          >
            <template #right-icon>
              <van-checkbox
                :name="index"
                :disabled="item.url !== 'javascript:void();' ? false: true"
                class="selectChapter"
                icon-size="24px"
                @click="radioSelect(index)"
              />
            </template>
          </van-cell>
        </van-checkbox-group>
      </van-cell-group>
    </div>

  </div>
</template>

<script>

import { currentComics } from '@/utils/comics'
import { getStorage } from '@/config/setup'

import { Toast } from 'vant'

export default {
  name: 'Table',
  data() {
    return {
      list: [],
      selectResult: [],
      downResult: [],

      showSelectList: false,
      overlayShow: false,

      currentComics: '',
      webname: '未匹配',
      comicName: '------',

      paylogoArr: []
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      try {
        this.currentComics = currentComics
        if (currentComics === null) {
          return
        }
        const comicNameCss = this.currentComics.comicNameCss
        this.webname = currentComics.webName
        this.comicName = document.querySelector(comicNameCss).innerText
      // eslint-disable-next-line no-empty
      } catch (error) {
        // console.log('error: ', error)
      }
    },
    selectAll() {
      this.$refs.checkboxGroup.toggleAll(false)
      if (currentComics.hasSpend) {
        this.list.forEach((element, index) => {
          if (element.url !== 'javascript:void();') {
            this.selectResult.push(index)
          }
        })
        return
      }
      this.$refs.checkboxGroup.toggleAll(true)
    },
    CancelSelect() {
      this.$refs.checkboxGroup.toggleAll(false)
    },

    radioSelect(index) {
      // console.log('index', this.selectResult)
    },
    async getSelectList() {
      this.overlayShow = true
      const chapterCss = currentComics.chapterCss
      setTimeout(() => {
        if (currentComics.hasSpend) {
          this.paylogoArr = []
          const logoCss = currentComics.freeCss + ',' + currentComics.payCss
          const logoArr = document.querySelectorAll(logoCss)
          logoArr.forEach((element, index) => {
            if ('.' + logoArr[index].className === currentComics.payCss) {
              this.paylogoArr.push(true)
            } else {
              this.paylogoArr.push(false)
            }
          })
        }
        const nodeList = document.querySelectorAll(chapterCss)
        nodeList.forEach(dom => {
          const urls = dom.querySelectorAll('a')
          const type = currentComics.type
          urls.forEach((element, index) => {
            let chapterName = element.innerText.replace(/\n|\r/g, '')
            chapterName = chapterName.trim()
            const data = {
              comicName: this.comicName,
              chapterName: chapterName,
              url: element.href,
              type: type
            }
            if (currentComics.hasSpend) {
              data.isPay = this.paylogoArr[index]
              if (data.isPay) {
                data.url = 'javascript:void();'
              }
            }
            this.list.push(data)
          })
        })
        this.overlayShow = false
        this.showSelectList = true
      }, 100)
    },
    downSelectList() {
      if (this.selectResult.length === 0) {
        Toast({
          message: '请选择章节',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      this.selectResult.forEach(num => {
        this.downResult.push(this.list[num])
      })
      this.$bus.$emit('selectDown', this.downResult)
      this.$bus.$emit('changTab', 2)
      this.downResult = []
      this.selectResult = []
    },
    reloadList() {
      this.list = []
      this.selectResult = []
      this.getSelectList()
    }
  }
}
</script>

<style lang="scss" scoped>
#comiclist {
  margin-top:  15px;
  border-radius: 15px;
  position: relative;
  height: 650px;
}
#overlayDom {
  background-color: #eeeeeece;
}
#select-list {
  max-height: 600px;
  overflow-y:auto;
}

#editItem {
  display: flex;
  justify-content: space-between;
  margin: 0px 15px;
  padding: 5px;
  display: flex;
  flex-wrap: wrap;

}

#comicinfo {
  width: 280px;
  margin: 20px auto;
  .van-cell__title {
    max-width: 80px !important;
  }
}

input {
  margin-left: 5px;
  margin-right: 5px;
  width: 50px;
}
</style>
