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
            :title="item.chapterName"
          >
            <template #right-icon>
              <van-checkbox
                :name="index"
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
import { Toast } from 'vant'

export default {
  name: 'Table',
  data() {
    return {
      list: [],
      selectResult: [],
      downResult: [],

      showSelectList: false,
      currentComics: '',

      webname: '未匹配',
      comicName: '------',
      chapterReg: ''

    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.currentComics = currentComics
      if (currentComics === null) {
        return
      }
      const comicNameCss = this.currentComics.comicNameCss
      this.webname = currentComics.webName
      this.comicName = document.querySelector(comicNameCss).innerText
      this.chapterReg = currentComics.reg
    },
    selectAll() {
      this.$refs.checkboxGroup.toggleAll(true)
    },
    CancelSelect() {
      this.$refs.checkboxGroup.toggleAll(false)
    },

    radioSelect(index) {
      console.log('选择index', this.selectResult)
    },
    async getSelectList() {
      this.showSelectList = true
      await this.$nextTick()
      const chapterCss = currentComics.chapterCss
      setTimeout(() => {
        const nodeList = document.querySelectorAll(chapterCss)
        nodeList.forEach(dom => {
          const urls = dom.querySelectorAll('a')
          const type = currentComics.type
          urls.forEach(element => {
            this.list.push(
              { comicName: this.comicName,
                chapterName: element.innerText,
                url: element.href,
                type: type }
            )
          })
        })
      }, 200)
    },
    downSelectList() {
      if (this.selectResult.length === 0) {
        Toast('请选择章节')
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
