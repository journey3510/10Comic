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

      <!-- <input v-model="startIndex" type="number" min="1" max=""> - <input type="number" :min="startIndex" :max="endIndex">
      <van-button
        type="primary"
        size="mini"
        @click="scopeSelect"
      >范围选择</van-button> -->

      <van-button
        style="width:80px;"
        size="mini"
        round
        type="primary"
        :disabled="!showSelectList"
        @click="downSelectList"
      >下载</van-button>
    </div>

    <!-- <van-divider /> -->
    <van-divider
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 15px',height: '10px' }"
    >章节列表</van-divider>

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

      <van-cell-group style="width: 280px;margin: 20px auto;" inset>
        <van-cell title="网站" :value="webname" />
        <van-cell title="漫画" :value="comicName" />
      </van-cell-group>

    </div>

    <!-- 展示列表 -->
    <div
      v-if="showSelectList"
      id="select-list"
      v-loading="selectListLoading"
    >
      <van-cell-group
        style="border-radius: 25px;"
        inset
      >
        <van-checkbox-group ref="checkboxGroup" v-model="selectResult">
          <van-cell
            v-for="(item,index) in list"
            :key="index"
            :title="item.name"
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
      startIndex: 1,
      endIndex: 10,

      list: [],
      selectResult: [],
      downResult: [],

      selectListLoading: false,
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
      // console.log(currentComics)
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
      console.log('this.selectResult: ', this.selectResult)
    },
    scopeSelect() {

    },
    async getSelectList() {
      this.showSelectList = true
      this.selectListLoading = true
      await this.$nextTick()
      const chapterCss = currentComics.chapterCss
      setTimeout(() => {
        const dom = document.querySelector(chapterCss)
        console.log('dom: ', dom)

        const urls = dom.querySelectorAll('a')
        urls.forEach(element => {
          this.list.push(
            { name: element.innerText,
              url: element.href }
          )
        })
        this.selectListLoading = false
      }, 200)
    },
    downSelectList() {
      if (this.selectResult.length === 0) {
        Toast('请选择章节')
        return
      }
      this.selectResult.forEach(element => {
        this.downResult.push(this.list[element])
      })
      this.$bus.$emit('selectDown', this.downResult)
      this.$bus.$emit('changTab', 2)
      this.downResult = []
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

input {
  margin-left: 5px;
  margin-right: 5px;
  width: 50px;
}
</style>
