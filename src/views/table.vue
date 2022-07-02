<template>
  <div id="comiclist">
    <!-- 编辑选项 -->
    <div id="editItem">
      <div>

        <van-button
          type="primary"
          size="mini"
          @click="selectAll"
        >全选</van-button>
        <van-button
          type="primary"
          size="mini"
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
        @click="downSelectList"
      >下载</van-button>
    </div>

    <!-- <van-divider /> -->
    <van-divider
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 15px',height: '10px' }"
    >章节列表</van-divider>

    <!-- 列表为空 -->
    <div v-if="!showSelectList">
      <van-empty description="描述文字">
        <van-button
          style="width:120px;"
          round
          type="primary"
          class="bottom-button"
          @click="getSelectList"
        > 加载 </van-button>
      </van-empty>
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
      showSelectList: false

    }
  },
  created() {

  },
  methods: {
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
      const chapterCssID = currentComics.chapterCssID
      setTimeout(() => {
        const dom = document.getElementById(chapterCssID)
        const urls = dom.querySelectorAll('a')
        urls.forEach(element => {
          this.list.push(
            { name: element.innerText,
              urls: element.href }
          )
        })
        console.log(this.list)
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
