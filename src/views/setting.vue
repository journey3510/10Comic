<template>
  <div class="setindex">

    <van-swipe
      ref="swipe2"
      class="my-swipe"
      style="cursor: default;"
      :initial-swipe="0"
      :duration="5"
      :show-indicators="false"
    >
      <!-- :touchable="false" -->
      <van-swipe-item class="swipeitem">
        <div id="setpart">

          <van-cell-group id="app-loadset" title="app加载" inset>
            <van-cell
              title-class="cellleftvalue"
              value-class="cellrightvalue"
              center
            >
              <template #title>
                <span class="custom-title">随网页加载UI界面</span>
                <van-popover
                  v-model="showUiPopover"
                  placement="right-start"
                  get-container="#app-loadset"
                  :offset="[-2,10]"
                  :close-on-click-outside="true"
                >
                  <code class="popovertext">关闭后可通过快捷键唤起</code>
                  <template #reference>
                    <van-icon
                      name="info-o"
                      color="red"
                      @mouseover="showUiPopover = true"
                      @mouseleave="showUiPopover = false"
                    />
                  </template>
                </van-popover>
              </template>

              <template #default>
                <van-checkbox
                  v-model="appLoadDefault.isShowUI"
                  class="rightbutton"
                  @change="onChangeData('appLoadDefault', appLoadDefault.isShowUI, 'isShowUI')"
                />
              </template>
            </van-cell>

            <van-cell
              title-class="cellleftvalue"
              value-class="cellrightvalue"
              center
            >
              <template #title>
                <span class="custom-title">加载界面快捷键</span>
              </template>

              <template #default>
                <div>
                  <code style="width: 35px;">Alt + </code>
                  <input
                    id="hot-key-input"
                    v-model="appLoadDefault.loadHotKey"
                    class="rightbutton"
                    @input="loadHotKeyChange"
                  >
                </div>
              </template>
            </van-cell>

            <van-cell
              title-class="cellleftvalue"
              value-class="cellrightvalue"
              center
            >
              <template #title>
                <span class="custom-title">右边大小缩放(%)</span>
              </template>

              <template #default>
                <van-stepper
                  v-model="appRightSize"
                  class="rightbutton"
                  min="75"
                  max="125"
                  :default-value="100"
                  step="1"
                  integer
                  button-size="20px"
                  @change="changeRightSize(appRightSize)"
                />
              </template>
            </van-cell>

            <van-cell
              title-class="cellleftvalue"
              value-class="cellrightvalue"
              center
            >
              <template #title>
                <span class="custom-title">中间大小缩放(%)</span>
              </template>

              <template #default>
                <van-stepper
                  v-model="appCenterSize"
                  class="rightbutton"
                  min="75"
                  max="125"
                  :default-value="100"
                  step="1"
                  integer
                  button-size="20px"
                  @change="changeCenterSize(appCenterSize)"
                />
              </template>
            </van-cell>
          </van-cell-group>

          <van-cell-group id="downpart" title="下载" inset>
            <van-cell label="*下载前生效" center>
              <template #title>
                <span style="width: 300px" class="custom-title">最大下载章节数</span>
              </template>

              <template #default>
                <div style="display: flex;">
                  1&nbsp;
                  <van-slider
                    v-model="maxChapterNum"
                    class="rightslider"
                    :min="1"
                    :max="3"
                    @change="onChangeData('maxChapterNum', maxChapterNum)"
                  >
                    <template #button>
                      <div class="custom-button">{{ maxChapterNum }}</div>
                    </template>
                  </van-slider>&nbsp;3
                </div>
              </template>
            </van-cell>

            <van-cell label="*下载前生效" center>
              <template #title>
                <span style="width: 300px" class="custom-title">每章最大下载图片数</span>
              </template>

              <template #default>
                <div style="display: flex;">
                  1&nbsp;
                  <van-slider
                    v-model="maxPictureNum"
                    class="rightslider"
                    :min="1"
                    :max="5"
                    @change="onChangeData('maxPictureNum', maxPictureNum)"
                  >
                    <template #button>
                      <div class="custom-button">{{ maxPictureNum }}</div>
                    </template>
                  </van-slider>&nbsp;5
                </div>
              </template>
            </van-cell>

            <van-cell
              title-class="cellleftvalue"
              value-class="cellrightvalue"
              label="*本次默认设置，修改后下次启动默认生效"
              center
            >
              <template #title>
                <span class="custom-title">下载方式</span>
                <van-popover
                  v-model="downTypePopover"
                  placement="right"
                  get-container="#downpart"
                  :offset="[-18,10]"
                  :close-on-click-outside="true"
                >
                  <div>
                    <code class="popovertext">* 如需保存在文件夹需要设置油猴下载模式为浏览器API</code>
                  </div>
                  <template #reference>
                    <van-icon
                      name="info-o"
                      color="red"
                      @mouseover="downTypePopover = true"
                      @mouseleave="downTypePopover = false"
                    />
                  </template>
                </van-popover>
              </template>

              <template #default>
                <div
                  class="dropdown"
                  @mouseover="showDropDown = true"
                  @mouseleave="showDropDown = false"
                >
                  <button
                    class="dropbtn"
                  >{{ dropItem[downType].Text }}</button>

                  <div
                    v-show="showDropDown"
                    id="myDropdown"
                    class="dropdown-content"
                  >
                    <a
                      v-for="(item,index) in dropItem"
                      :key="index"
                      href="#"
                      @click="changeDownType(item.value)"
                    >
                      <div :title="item.hint">
                        {{ item.Text }}
                        <van-icon v-show="item.hint" name="info-o" color="red" />
                      </div>
                    </a>
                  </div>
                </div>
              </template>
            </van-cell>

            <van-cell
              title-class="cellleftvalue"
              value-class="cellrightvalue"
              label="*本次启动默认设置,修改刷新生效"
              center
            >
              <template #title>
                <span class="custom-title">图片序号最少位数</span>
                <van-popover
                  v-model="addZeroHint"
                  placement="right"
                  get-container="#downpart"
                  :offset="[-5,5]"
                  :close-on-click-outside="true"
                >
                  <div>
                    <code class="popovertext">* 不足则向前补充"0"</code><br>
                    <code class="popovertext">* 选择1，则默认数字序号</code>
                  </div>
                  <template #reference>
                    <van-icon
                      name="info-o"
                      color="red"
                      @mouseover="addZeroHint = true"
                      @mouseleave="addZeroHint = false"
                    />
                  </template>
                </van-popover>
              </template>

              <template #default>
                <van-stepper
                  v-model="imgIndexBitNum"
                  class="rightbutton"
                  max="5"
                  integer
                  button-size="20px"
                  @change="onChangeData('imgIndexBitNum', imgIndexBitNum)"
                />
              </template>
            </van-cell>
          </van-cell-group>

          <van-cell-group id="webpart" title="原网站阅读样式修改" inset>
            <van-cell
              title-class="cellleftvalue"
              value-class="cellrightvalue"
              label="去除部分漫画网站图片上下间隔"
              center
            >
              <template #title>
                <span class="custom-title">图片拼接</span>
                <van-popover
                  v-model="showPopover"
                  placement="right-start"
                  get-container="#webpart"
                  :offset="[0,10]"
                  :close-on-click-outside="true"
                >
                  <code class="popovertext">建议浏览长条漫画时开启</code>
                  <template #reference>
                    <van-icon
                      name="info-o"
                      color="red"
                      @mouseover="showPopover = true"
                      @mouseleave="showPopover = false"
                    />
                  </template>
                </van-popover>
              </template>

              <template #default>
                <van-checkbox
                  v-model="imgSplicingFlag"
                  class="rightbutton"
                  @change="webImgSplicing"
                />
              </template>
            </van-cell>
          </van-cell-group>

          <van-cell-group title="自定义规则" inset>
            <van-cell
              title-class="cellleftvalue"
              value-class="cellrightvalue"
              title="导入规则"
              is-link
              center
              @click="changeSwipe(1)"
            />
            <van-cell
              title-class="cellleftvalue"
              value-class="cellrightvalue"
              title="清空导入的规则"
              is-link
              center
              @click="deleteAllUserWeb()"
            />
          </van-cell-group>

          <van-cell-group id="otherpart" title="其他" inset>
            <van-cell
              title-class="cellleftvalue"
              value-class="cellrightvalue"
              title="脚本反馈/评分"
              is-link
              center
              @click="jump('https://greasyfork.org/zh-CN/scripts/447819/feedback')"
            />
          </van-cell-group>
        </div>

        <div id="set-bottom">
          <van-button
            :style="{width: '120px',background: '#ee000055 !important'}"
            size="small"
            round
            @click="allInit"
          >全部重置</van-button>
        </div>
      </van-swipe-item>

      <van-swipe-item :style="{marginBottom: '15px',cursor: 'pointer',flex: 1}" class="swipeitem">
        <div>
          <div
            id="setup-return"
            @click="changeSwipe(0)"
          >
            <van-icon name="arrow-left" /> 返回
          </div>
          <!-- 组件 -->
          <import-page v-if="setupOtherPage === 1" />
        </div>
      </van-swipe-item>

    </van-swipe>

  </div>
</template>

<script>
/* eslint-disable no-undef */
import { currentComics } from '@/utils/comics'
import { setinit, setStorage } from '@/config/setup'
import { loadStyle } from '@/utils/index'

import { Dialog } from 'vant'

import importPage from '@/components/importPage.vue'

export default {
  name: 'Setting',
  components: {
    importPage
  },
  data() {
    return {
      appLoadDefault: {
        isShowUI: true,
        loadHotKey: '',
        rightSize: 100,
        centerSize: 100
      },
      appRightSize: 100,
      appCenterSize: 100,
      maxChapterNum: 1,
      maxPictureNum: 2,
      imgIndexBitNum: 3,
      imgSplicingFlag: false,
      //
      downTypePopover: false,
      addZeroHint: false,
      showPopover: false,
      showUiPopover: false,
      setupOtherPage: 0,

      showDropDown: false,
      downType: 0,
      dropItem: [
        { Text: '直接下载', value: 0 },
        { Text: '压缩下载', value: 1 },
        { Text: '拼接下载', value: 2, hint: '拼接后单张高度不超过 10000 像素' }
      ]

    }
  },
  mounted() {
    this.getAllData()
    this.$bus.$on('changeSetupFirstPage', () => { this.changeSwipe(0) })
  },
  methods: {
    jump(url) {
      window.open(url, '_blank')
    },
    onChangeData(key, value, key2) {
      setStorage(key, value, key2)
    },
    changeRightSize(num) {
      if (num === undefined) {
        num = 100
      }
      const appRightDom = document.getElementById('app-right')
      appRightDom.style.scale = num / 100
      this.onChangeData('appLoadDefault', num, 'rightSize')
    },
    changeCenterSize(num) {
      if (num === undefined) {
        num = 100
      }
      const appRightDom = document.getElementById('search-page')
      appRightDom.style.scale = num / 100
      this.onChangeData('appLoadDefault', num, 'centerSize')
    },
    loadHotKeyChange(obj) {
      if (obj.data) {
        this.appLoadDefault.loadHotKey = obj.data.toUpperCase()
        this.onChangeData('appLoadDefault', this.appLoadDefault.loadHotKey, 'loadHotKey')
      }
    },
    webImgSplicing(value) {
      const splicingimgstyle = document.getElementById('splicingimgstyle')
      if (value === true && currentComics && currentComics.readCssText !== undefined) {
        if (splicingimgstyle) {
          splicingimgstyle.innerText = currentComics.readCssText
        } else {
          loadStyle('', 'splicingimgstyle', currentComics.readCssText)
        }
      } else {
        if (splicingimgstyle) {
          splicingimgstyle.innerText = ''
        }
      }
      this.onChangeData('imgSplicingFlag', value)
    },
    changeSwipe(val) {
      console.log('val: ', val)
      this.$refs.swipe2.swipeTo(val)
      this.setupOtherPage = val
    },
    changeDownType(val) {
      if (this.downType !== val) {
        this.downType = val
        this.onChangeData('downType', val)
      }
    },
    exeFun(flag, basic) {
      let rightSize = 100; let centerSize = 100
      basic.rightSize ? rightSize = basic.rightSize : ''
      basic.rightSize ? this.appRightSize = basic.rightSize : ''
      this.changeRightSize(rightSize)

      basic.centerSize ? centerSize = basic.centerSize : ''
      basic.centerSize ? this.appCenterSize = basic.centerSize : ''
      this.changeRightSize(centerSize)

      this.webImgSplicing(flag)
    },
    getAllData() {
      try {
        this.maxChapterNum = GM_getValue('maxChapterNum')
        this.maxPictureNum = GM_getValue('maxPictureNum')
        this.downType = GM_getValue('downType')
        this.imgIndexBitNum = GM_getValue('imgIndexBitNum')
        this.imgSplicingFlag = GM_getValue('imgSplicingFlag')
        //
        this.appLoadDefault = GM_getValue('appLoadDefault')
      // eslint-disable-next-line no-empty
      } catch (error) {}
      // 获取数据后执行其他方法
      this.exeFun(this.imgSplicingFlag, this.appLoadDefault)
    },
    async allInit() {
      Dialog.confirm({
        getContainer: '.card',
        message: '确认重置'
      })
        .then(() => {
          setinit().then((result) => {
            this.getAllData()
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    deleteAllUserWeb() {
      Dialog.confirm({
        getContainer: '.card',
        message: '确认清空'
      })
        .then(() => {
          setStorage('userWebInfo', [])
          this.$bus.$emit('getWeb')
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style lang="less" scoped>
.setindex {
  // display: flex;
  .swipeitem {
    display: flex;
    flex-direction: column;
    margin: 20px 18px 15px 18px;
    flex: 1;
    height: 680px;
    max-height: 680px;
    justify-content: space-between;
    #setup-return{
      flex: 1;
      margin-bottom: 15px;
      cursor: pointer;
      font-size: 17px;
    }
    #setup-return:hover{
      color: @lingColor;
    }
  }

  #setpart {
    // display: flex;
    // flex-direction: column;
    border-radius: 15px;
    background-color: #ffffff;
    overflow: auto;
    width: 100%;

    .van-cell-group__title {
      color: #78a5ff;
      font-size: 15px;
    }

    .van-cell {
      width: 100%;
      padding: 10px 1px;
      overflow: visible !important;

      .van-cell__value {
        overflow: visible !important;

      }
      .cellleftvalue {
        flex: 1;
      }
      .cellrightvalue {
        flex: 0.5 !important;

        // 下拉
        .dropbtn {
          width: 90px;
          background-color: #aadafb;
          color: white;
          padding: 2px 5px;
          font-size: 16px;
          border: none;
          cursor: pointer;
        }

        .dropbtn:hover, .dropbtn:focus {
          background-color: #47b1f7;
        }

        .dropdown {
          position: relative;
          // display: inline-block;
        }

        .dropdown-content {
          // display: none;
          position: absolute;
          right: 0;
          background-color: #fff;
          min-width: 90px;
          overflow: auto;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          z-index: 1;
        }

        .dropdown-content a {
          color: black;
          padding: 0px 2px;
          text-decoration: none;
          text-align: center;
          display: block;
        }

        .dropdown a:hover {background-color: #ddd;}

        .show {display: block;}
      }
      // 右侧按钮
      .rightbutton {
        flex-direction: row-reverse;
      }
      .custom-title {
        text-align: left;
      }
      #hot-key-input {
        width: 35px;
        height: 18px;
        margin-right: 2px;
        border: 1px #66ccff solid;
        border-radius: 10px;
        text-align: center;
        background: #fff;
      }

      // 修改滑动条
      .rightslider {
        margin: 10px 15px;
        width: 120px;
          // 滑动按钮
          .custom-button {
            width: 20px;
            color: #fff;
            font-size: 14px;
            line-height: 15px;
            text-align: center;
            background-color: #ee0a24;
            border-radius: 100px;
          }
       }
    }
  }

  #set-bottom {
    display: flex;
    justify-content: center;
    margin-top: 7px;
    margin-bottom: 5px;
  }
}
</style>
