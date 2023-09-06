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
        height: '40%',
        borderTop: '1px solid #fcadad',
        marginTop: '-15px'
      }"
    >
      <van-cell-group title="选项" :style="{display: 'flex',flexDirection: 'column', width: '350px', margin: '10px auto'}" inset>
        <label style="margin-top: 5px;margin-left: 16px;text-align: left;">本次下载(临时更改)</label>
        <van-cell title="">
          <template #right-icon>
            <br>
            <van-radio-group v-model="downType" direction="horizontal">
              <van-radio :name="0">直接下载</van-radio>
              <van-radio :name="1">压缩下载</van-radio>
              <van-radio :name="2" title="拼接后单张高度不超过 10000 像素">拼接下载<van-icon name="info-o" color="red" /></van-radio>
            </van-radio-group>
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

        <div
          style="margin-top: 8px;
          display: flex;
          height: 25px;
          line-height: 25px;
          justify-content: space-between;"
        >
          <label style="margin-left: 16px;text-align: left;" for="">下载当前阅读章节 (测试)</label>
          <van-button
            type="default"
            size="mini"
            @click="getCurrentWebData"
          >获取</van-button>
        </div>

        <van-cell title="" style="padding-top: 0px;">
          <template #right-icon>
            <van-field
              v-model="defineComicName"
              name="defineComicName"
              placeholder="漫画名"
            />
            <van-field
              v-model="definechapterName"
              name="definechapterName"
              placeholder="章节名"
            />
          </template>
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
      <div id="select-list-top">

        <div id="select-list-info">
          <div id="select-list-info-left">
            <span>颜色</span>
            <span class="span-circle" style="background: blue;" title="免费" />
            <span class="span-circle" style="background: #AA6680;" title="最新/其它/单行本/卷" />
            <span class="span-circle" style="background: red;" title="付费" />
            <span class="span-circle" style="background: #ccc;" title="无效" />
          </div>
          <div id="select-list-info-right">
            <van-icon
              :style="{cursor: 'pointer'}"
              name="edit"
              color="#66ccff"
              size="18"
              title="编辑"
              @click="editList"
            />

            <van-icon
              :style="{cursor: 'pointer'}"
              name="sort"
              color="#ee000088"
              size="18"
              title="排序"
              @click="reverseList"
            />
          </div>
        </div>

        <div v-show="isEditList" id="select-show-edit">
          <div style="display: flex;align-items: center;">
            <label style="text-align: left;margin-right: 20px;" for="">删除所选章节首个字符</label>
            <van-button
              type="default"
              size="mini"
              @click="delOnechapterNameFont(1)"
            >删除</van-button>
          </div>

          <div style="display: flex;align-items: center;margin-top: 3px;margin-bottom: 3px;">
            <label style="text-align: left;margin-right: 20px;" for="">删除所选章节末尾一个字符</label>
            <van-button
              type="default"
              size="mini"
              @click="delOnechapterNameFont(-1)"
            >删除</van-button>
          </div>

        </div>
      </div>

      <div id="select-list-2">
        <van-cell-group
          id="select-list-2-1"
          :style="isEditList ? 'max-height: 530px;' : 'max-height: 585px;'"
          inset
        >
          <van-cell
            v-for="(item,index) in list"
            :key="index"
            :style="titleStyle(item.url, item.isPay, item.characterType)"
            :title="showComicTitleName(item.chapterNumStr, item.chapterName)"
          >
            <!-- 左 -->
            <template v-if="isEditList" #title>
              <div style="display: flex;justify-content: space-around;">
                <label :for="item.chapterNumStr">{{ item.chapterNumStr }}</label>
                <input v-model="item.chapterName" class="input-chaptername" type="text">
              </div>
            </template>

            <!-- 右 -->
            <template #right-icon>
              <van-checkbox
                v-model="item.isSelect"
                :name="index"
                :disabled="item.url !== 'javascript:void();' ? false: true"
                class="selectChapter"
                icon-size="24px"
                @click="radioSelect(item.isSelect, index)"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>

  </div>
</template>

<script>

import { currentComics } from '@/utils/comics'
import { getStorage } from '@/config/setup'
import { addZeroForNum, trimSpecial } from '@/utils/index'

import { Toast } from 'vant'

export default {
  name: 'Table',
  data() {
    return {
      list: [],
      downResult: [],
      lastSelectIndex: null,
      onShfit: false,

      showSelectList: false,
      overlayShow: false,
      show: false,
      isEditList: false,

      currentComics: '',
      webname: '未匹配',
      comicName: '------',

      paylogoArr: [],
      downType: 0,
      useCharacterNum: false,
      characterNumSequence: false,

      defineComicName: '',
      definechapterName: ''

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
        const newname = name === '' ? '' : ('-' + name)
        showname = numStr + newname
        return showname
      }
      return name
    },
    editList() {
      this.overlayShow = true
      this.isEditList = !this.isEditList
      this.overlayShow = false
    },
    // 删除章节一个字符
    delOnechapterNameFont(pos) {
      this.list.forEach((element, index) => {
        if (element.isSelect === true && element.chapterName.length >= 1) {
          if (pos === 1) {
            element.chapterName = element.chapterName.slice(1)
          } else {
            element.chapterName = element.chapterName.slice(0, -1)
          }
        }
      })
    },
    getInfo(times) {
      try {
        this.currentComics = currentComics
        if (currentComics === null) {
          return
        }
        const comicNameCss = this.currentComics.comicNameCss
        this.webname = currentComics.webName

        this.comicName = document.querySelectorAll(comicNameCss)[0].innerText.split('\n')[0].trim()
        if (this.comicName === '') {
          setTimeout(() => {
            this.getInfo(1)
          }, 1500)
          return
        }
        this.$bus.$emit('getComicName', this.comicName)
        //
        this.downType = getStorage('downType')
      // eslint-disable-next-line no-empty
      } catch (error) {
        if (times === undefined) {
          setTimeout(() => {
            this.getInfo(1)
          }, 1500)
        }
        console.log('getInfo-e: ', error)
      }
      this.lastSelectIndex = null
      return
    },
    reverseList() {
      this.overlayShow = true
      this.list = this.list.reverse()
      this.lastSelectIndex = null
      this.overlayShow = false
    },
    selectAll() {
      this.list.forEach((element, index) => {
        if (element.url !== 'javascript:void();') {
          element.isSelect = true
        }
      })
      this.lastSelectIndex = null
    },
    CancelSelect() {
      this.list.forEach((element, index) => {
        element.isSelect = false
      })
      this.lastSelectIndex = null
    },
    radioSelect(isSelect, index) {
      if (!isSelect) {
        this.lastSelectIndex = null
        return
      }
      let minIndex, maxIndex
      if (this.lastSelectIndex < index) {
        minIndex = this.lastSelectIndex
        maxIndex = index
      } else {
        minIndex = index
        maxIndex = this.lastSelectIndex
      }

      if (this.onShfit && this.lastSelectIndex !== null) {
        for (let i = minIndex; i < maxIndex; i++) {
          if (this.list[i].url !== 'javascript:void();') {
            this.list[i].isSelect = true
          }
        }
      }
      this.lastSelectIndex = index
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
      try {
        // 单页面应用 获取信息
        if (currentComics.getComicInfo) {
          this.list = await currentComics.getComicInfo(this.comicName)
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
      } catch (error) {
        console.log('getSelectList-e: ', error)
        Toast({
          message: '网站未匹配或方法已失效',
          getContainer: '.card',
          position: 'bottom'
        })
        setTimeout(() => {
          this.overlayShow = false
        }, 3000)
      }
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
              chapterName = element.innerText
            } else {
              chapterName = element.outerHTML.match(chapterNameReg)[1]
            }
            chapterName = trimSpecial(chapterName)
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
            comicName: trimSpecial(this.comicName),
            chapterNumStr: '',
            chapterName,
            downChapterName: '',
            url: element.href,
            characterType: type,
            readtype,
            isPay: currentIsPay,
            isSelect: false
          }

          if (data.chapterName !== '') {
            this.list.push(data)
          }
        })
      })
    },

    // 已进入原网站漫画章节页面阅读，获取章节 下载
    getCurrentWebData() {
      if (!currentComics) {
        Toast({
          message: '未在匹配网站',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      if (this.defineComicName === '' || this.definechapterName === '') {
        Toast({
          message: '请输入名称',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }
      const item = {
        comicName: this.defineComicName,
        chapterNumStr: '',
        chapterName: this.definechapterName,
        downChapterName: this.definechapterName,
        url: window.location.href,
        characterType: 'one',
        readtype: currentComics.readtype,
        isPay: currentComics.hasSpend,
        downType: this.downType,
        downHeaders: currentComics.downHeaders
      }
      this.downResult.push(item)

      this.$bus.$emit('selectDown', this.downResult)
      this.$bus.$emit('changTab', 2)
      this.downResult = []
      this.show = false
    },
    downSelectList() {
      let hasSelect = false
      this.list.forEach((item, index) => {
        if (item.isSelect) {
          item.downType = this.downType
          item.downHeaders = currentComics.downHeaders
          if (!hasSelect && item.isSelect) {
            hasSelect = true
          }

          if (item.chapterNumStr !== '' && item.chapterNumStr !== undefined) {
            const newName = item.chapterName === '' ? '' : ('-' + item.chapterName)
            item.downChapterName = item.chapterNumStr + newName
          } else {
            item.downChapterName = item.chapterName
          }

          // 下载的章节名可能修改为空，为空跳过
          if (item.downChapterName !== '') {
            this.downResult.push(item)
            item.isSelect = false
          }
        }
      })

      if (!hasSelect) {
        Toast({
          message: '请选择章节',
          getContainer: '.card',
          position: 'bottom'
        })
        return
      }

      this.$bus.$emit('selectDown', this.downResult)
      this.$bus.$emit('changTab', 2)
      this.downResult = []
    },
    reloadList() {
      this.list = []
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

  #select-list-top {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 0 10px 0 10px;
    min-height: 30px;
    border-bottom: 1px solid #ccc5;
    border-radius: 10px;

    #select-list-info {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      min-height: 30px;

      #select-list-info-left {
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

      #select-show-edit {
        margin: 10px;
      }
    }
  }

  #select-list-2 {
    margin-top: 5px;
    overflow: hidden;
    #select-list-2-1 {
      max-height: 585px;
      overflow-y:auto;
      ::-webkit-scrollbar-track-piece {
        background-color: #fff !important;
      }
      .input-chaptername {
        border: 1px solid @yiColor;
        flex: 1;
        border-radius: 5px;
        background: #fff;
        line-height: 20px;
        padding-left: 15px;
        padding-top: 1px;
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
