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
      <van-cell-group title="选项" :style="{display: 'flex',width: '250px', margin: '10px auto'}" inset>
        <van-cell title="本次压缩下载">
          <template #right-icon>
            <van-checkbox
              v-model="zipDownFlag"
              label-position="left"
              class="rightbutton"
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
      <van-cell
        id="select-list-1"
        center
        title="排序"
      >
        <template #right-icon>
          <van-icon
            :style="{cursor: 'pointer'}"
            name="sort"
            color="#ee000055"
            size="18"
            @click="reverseList"
          />
          <van-icon />
        </template>
      </van-cell>

      <div id="select-list-2">
        <van-cell-group
          id="select-list-2-1"
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
      zipDownFlag: true
    }
  },
  mounted() {
    this.watchKeyEvent()
    this.getInfo()
  },
  methods: {
    getInfo(times) {
      try {
        this.currentComics = currentComics
        if (currentComics === null) {
          return
        }
        const comicNameCss = this.currentComics.comicNameCss
        this.webname = currentComics.webName
        this.comicName = document.querySelector(comicNameCss).innerText
        this.$bus.$emit('getComicName', this.comicName)
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
      if (currentComics.getComicInfo) {
        this.list = await currentComics.getComicInfo()
        this.overlayShow = false
        this.showSelectList = true
        return
      }

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
          const readtype = currentComics.readtype
          urls.forEach((element, index) => {
            let chapterName = element.innerText.replace(/\n|\r/g, '')
            chapterName = chapterName.trim()
            const data = {
              comicName: this.comicName,
              chapterName: chapterName,
              url: element.href,
              readtype
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
        const item = this.list[num]
        item.zipDownFlag = this.zipDownFlag
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
      this.getSelectList()
    }
  }
}
</script>

<style lang="less" scoped>
.comiclist {
  margin-top:  10px;
  position: relative;
  height: 690px;
}
#overlayDom {
  background-color: #eeeeeece;
}
#select-list {
  margin: 0 15px;
  #select-list-1 {
    color:#ee000055;
    font-size: 16px;
    font-weight: bold;
    height: 30px;
    border-bottom: 1px solid #ccc5;
    border-radius: 10px;
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
