<template>
  <div ref="comiclist" class="comiclist">
    <!-- 下载选项弹窗 -->
    <van-popup
      v-model="show"
      get-container="#chapterpage"
      round
      position="top"
      :style="{
        position: 'absolute' ,
        width: '100%',
        height: '30%',
        borderTop: '1px solid #fcadad',
        marginTop: '-15px'
      }"
    >
      <van-cell-group title="选项" :style="{display: 'flex',flexDirection: 'column', width: '350px', margin: '10px auto'}" inset>
        <van-cell title="本次压缩下载">
          <template #right-icon>
            <van-checkbox
              v-model="zipDownFlag"
              label-position="left"
              class="rightbutton"
            />
          </template>
        </van-cell>

        <van-cell>
          <div :style="{display: 'flex',justifyContent: 'space-between'}">
            <van-checkbox
              v-model="useCharacterNum"
              label-position="left"
              @change="characterSequenceChange"
            >章节补充序号
            </van-checkbox>
            <van-checkbox
              v-model="characterNumSequence"
              :disabled="!useCharacterNum"
              label-position="left"
              @change="characterSequenceChange"
            >—序号反序
            </van-checkbox>
          </div>

        </van-cell>

      </van-cell-group>
    </van-popup>

    <!-- 编辑选项 -->
    <div id="editItem">
      <div>
        <van-button
          size="mini"
          :disabled="!showSelectList"
          @click="selectAll"
        >全选</van-button>
        <van-button
          size="mini"
          :disabled="!showSelectList"
          @click="CancelSelect"
        >取消</van-button>
      </div>

      <div class="editItem-center">
        选
        <van-icon
          :style="{cursor: 'pointer'}"
          name="more-o"
          color="#ee0000"
          size="25"
          @click="()=>{this.show = !this.show}"
        /> 项
      </div>

      <van-button
        style="width:80px;"
        size="mini"
        round
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
      style="border-radius: 25px;"
    >
      <div id="select-list-1">
        <div id="select-list-1-left">
          <span>颜色</span>
          <span class="span-circle" style="background: blue;" title="免费" />
          <span class="span-circle" style="background: #AA6680;" title="单行本/卷" />
          <span class="span-circle" style="background: red;" title="付费" />
          <span class="span-circle" style="background: #ccc;" title="无效" />
        </div>
        <div id="select-list-1-right">
          <van-icon
            :style="{cursor: 'pointer'}"
            name="sort"
            color="#ee000088"
            size="18"
            @click="reverseList"
          />
        </div>
      </div>

      <div id="select-list-2">
        <van-cell-group
          id="select-list-2-1"
          inset
        >
          <van-checkbox-group ref="checkboxGroup" v-model="selectResult">
            <van-cell
              v-for="(item,index) in list"
              :key="index"
              :style="titleStyle(item.url, item.isPay, item.characterType)"
              :title="showComicTitleName(item.chapterNumStr, item.chapterName)"
            >
              <!-- :title="item.chapterName" -->
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

  </div>
</template>

<script>

import { currentComics } from '@/utils/comics'
import { getStorage } from '@/config/setup'
import { addZeroForNum } from '@/utils/index'

import { Toast } from 'vant'

export default {
  name: 'Table',
  data() {
    return {
      list: [],
      listBack: [],
      selectResult: [],
      downResult: [],
      minListIndex: null,
      maxListIndex: null,
      onShfit: false,

      showSelectList: false,
      overlayShow: false,
      show: false,

      currentComics: '',
      webname: '未匹配',
      comicName: '------',

      paylogoArr: [],
      zipDownFlag: true,
      useCharacterNum: false,
      characterNumSequence: false

    }
  },
  computed: {

  },
  mounted() {
    this.watchKeyEvent()
    this.getInfo()
  },
  methods: {
    titleStyle: function(url, isPay, type) {
      if (url === 'javascript:void();') {
        return { color: '#ccc' }
      }
      if (isPay === true) {
        return { color: 'red' }
      }
      if (type === 'many') {
        return { color: '#AA6680' }
      }
      return `color: blue`
    },
    showComicTitleName(numStr, name) {
      let showname = ''
      if (numStr !== '') {
        showname = numStr + '-' + name
        return showname
      }
      return name
    },
    getInfo(times) {
      try {
        this.currentComics = currentComics
        if (currentComics === null) {
          return
        }
        const comicNameCss = this.currentComics.comicNameCss
        this.webname = currentComics.webName
        setTimeout(() => {
          this.comicName = document.querySelector(comicNameCss).innerText.split('\n')[0].trim()
          this.$bus.$emit('getComicName', this.comicName)
        }, 500)
        //
        this.zipDownFlag = getStorage('zipDownFlag')
      // eslint-disable-next-line no-empty
      } catch (error) {
        if (times === undefined) {
          setTimeout(() => {
            this.getInfo(1)
          }, 2000)
        }
        console.log('error: ', error)
      }
      return
    },
    reverseList() {
      this.overlayShow = true
      this.list = this.list.reverse()
      const listLength = this.list.length
      if (this.selectResult.length !== 0) {
        this.selectResult = this.selectResult.map((item) => {
          item = listLength - item - 1
          return item
        })
      }
      this.overlayShow = false
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
      this.minListIndex = null
      this.maxListIndex = null
    },
    radioSelect(index) {
      if (this.minListIndex === null || index < this.minListIndex) {
        this.minListIndex = index
      }
      if (this.maxListIndex === null || index > this.maxListIndex) {
        this.maxListIndex = index
      }
      if (this.minListIndex !== this.maxListIndex && this.onShfit) {
        for (let i = this.minListIndex; i < this.maxListIndex; i++) {
          if (this.list[i].url !== 'javascript:void();' && !this.selectResult.includes(i)) {
            this.selectResult.push(i)
          }
        }
      }
    },
    watchKeyEvent() {
      const setKeyStatus = (keyCode, status) => {
        switch (keyCode) {
          case 16:
            if (this.onShfit === status) return
            this.onShfit = status
            break
        }
      }
      const dom = this.$refs.comiclist
      dom.onkeydown = (e) => {
        setKeyStatus(e.keyCode, true)
      }
      dom.onkeyup = (e) => {
        setKeyStatus(e.keyCode, false)
      }
    },
    async getSelectList() {
      this.overlayShow = true

      // 单页面应用 获取信息
      if (currentComics.getComicInfo) {
        this.list = await currentComics.getComicInfo()
        this.overlayShow = false
        this.showSelectList = true
        return
      }

      setTimeout(() => {
        // 单章数据
        const nodeList = document.querySelectorAll(currentComics.chapterCss)
        this.getChapterData(nodeList, currentComics, 'one')

        // （如果存在）分卷数据
        if (currentComics.chapterCss_2) {
          const nodeList_2 = document.querySelectorAll(currentComics.chapterCss_2)
          this.getChapterData(nodeList_2, currentComics, 'many')
        }

        this.overlayShow = false
        this.showSelectList = true
      }, 100)
    },
    // 获取章节数据
    getChapterData(nodeList, currentComics, type) {
      const hasSpend = currentComics.hasSpend
      const chapterNameReg = currentComics.chapterNameReg
      nodeList.forEach(dom => {
        const urls = dom.querySelectorAll('a')
        const readtype = currentComics.readtype

        urls.forEach((element, index) => {
          let chapterName = ''
          try {
            if (!chapterNameReg) {
              chapterName = element.innerText.replace(/\n|\r/g, '')
              chapterName = chapterName.split('\n')[0].trim()
            } else {
              const linkOuterHTML = element.outerHTML
              chapterName = linkOuterHTML.match(chapterNameReg)[1]
            }
          } catch (error) {
            // console.log()
          }

          // 获取付费标志
          let currentIsPay = false
          if (hasSpend) {
            const payKey = currentComics.payKey
            const parent = element.parentElement
            if (parent.outerHTML.indexOf(payKey) > 0) {
              currentIsPay = true
            } else {
              currentIsPay = false
            }
          }

          const data = {
            comicName: this.comicName,
            chapterNumStr: '',
            chapterName: chapterName,
            url: element.href,
            characterType: type,
            readtype,
            isPay: currentIsPay
          }

          if (data.chapterName !== '') {
            this.list.push(data)
          }
        })
      })
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
        const item = this.list[num]
        item.zipDownFlag = this.zipDownFlag
        if (item.chapterNumStr !== '') {
          item.chapterName = item.chapterNumStr + '-' + item.chapterName
        }
        this.downResult.push(item)
      })
      this.$bus.$emit('selectDown', this.downResult)
      this.$bus.$emit('changTab', 2)
      this.downResult = []
      this.selectResult = []
    },
    reloadList() {
      this.list = []
      this.selectResult = []
      this.getInfo(1)
      this.getSelectList()
    },
    characterSequenceChange() {
      if (!this.useCharacterNum) {
        // 删除 前几个字符
        this.list.forEach((item, index) => {
          item.chapterNumStr = ''
        })
        return
      }

      if (this.characterNumSequence === true) {
        const len = this.list.length
        this.list.forEach((item, index) => {
          item.chapterNumStr = addZeroForNum(len - index, 3)
        })
      } else {
        this.list.forEach((item, index) => {
          item.chapterNumStr = addZeroForNum(index + 1, 3)
        })
      }
    },
    characterSequenceChange1() {
      if (!this.useCharacterNum) {
        // 删除 前几个字符
        this.list.forEach((item, index) => {
          item.chapterName = item.chapterName.split()
        })
        // this.list = JSON.parse(JSON.stringify(this.listBack))
        return
      }

      if (this.listBack.length === 0) {
        this.listBack = JSON.parse(JSON.stringify(this.list))
      }

      if (this.characterNumSequence === true) {
        const len = this.list.length
        this.list.forEach((item, index) => {
          item.chapterName = addZeroForNum(len - index, 3) + item.chapterName
        })
      } else {
        this.list.forEach((item, index) => {
          item.chapterName = addZeroForNum(index + 1, 3) + item.chapterName
        })
      }
      // console.log('sequence: ', sequence)
    }
  }
}
</script>

<style lang="less" scoped>
.comiclist {
  margin-top:  10px;
  position: relative;
  height: 690px;
  font-size: 14px !important;
}
#overlayDom {
  background-color: #eeeeeece;
}
#select-list {
  margin: 0 15px;
  #select-list-1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 0 10px 0 10px;

    height: 30px;
    border-bottom: 1px solid #ccc5;
    border-radius: 10px;

    #select-list-1-left {
      display: flex;
      width: 95px;
      justify-content: space-between;
      align-items: center;
      span.span-circle {
        width: 14px;
        height: 14px;
        display: flex;
        border-radius: 7px;
        cursor: pointer;
      }
    }
  }

  #select-list-2 {
    overflow: hidden;
    #select-list-2-1 {
      max-height: 590px;
      overflow-y:auto;
      ::-webkit-scrollbar-track-piece {
        background-color: #fff !important;
      }
    }
  }

  .van-cell-group--inset {
      margin: 0 0 !important;
      overflow: hidden;
      border-radius: 8px;
  }
}

#editItem {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 3px 20px !important;
  color: @lingColor;
  flex-wrap: wrap;
  .editItem-center {
    font-size: 18px;
  }
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
