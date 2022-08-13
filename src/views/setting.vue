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
              label="*本次启动默认设置, 不勾选则下载图片"
              center
            >
              <template #title>
                <span class="custom-title">压缩下载</span>
                <van-popover
                  v-model="zipDownPopover"
                  placement="right"
                  get-container="#downpart"
                  :offset="[-18,10]"
                  :close-on-click-outside="true"
                >
                  <div>
                    <code class="popovertext">* 如需保存在文件夹需要设置油猴下载模式为浏览器API</code><br>
                    <code class="popovertext">* 如有较多油猴弹窗提示跨域,建议取消勾选直接下载</code>
                  </div>
                  <template #reference>
                    <van-icon
                      name="info-o"
                      color="red"
                      @mouseover="zipDownPopover = true"
                      @mouseleave="zipDownPopover = false"
                    />
                  </template>
                </van-popover>
              </template>

              <template #default>
                <van-checkbox
                  v-model="zipDownFlag"
                  class="rightbutton"
                  @change="onChangeData('zipDownFlag', zipDownFlag)"
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
                  placement="bottom-start"
                  get-container="#webpart"
                  :offset="[-2,0]"
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

          <van-cell-group id="webpart" title="自定义源" inset>
            <van-cell
              title-class="cellleftvalue"
              value-class="cellrightvalue"
              title="导入"
              label="点击进入"
              is-link
              center
              @click="changeSwipe(1)"
            />
          </van-cell-group>
        </div>

        <div id="set-bottom">
          <van-button
            :style="{width: '120px',background: '#ee000055'}"
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
          <!--  -->
          <div>
            <textarea
              id="codeTextarea"
              ref="codeTextarea"
              v-model="codeText"
              style="resize:none;"
              :style="{width: '97%'}"
              rows="10"
            /> <br>
            <van-button
              type="primary"
              size="mini"
              @click="getCode"
            >确定</van-button>
          </div>
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

export default {
  name: 'Setting',
  data() {
    return {
      maxChapterNum: 1,
      maxPictureNum: 2,
      zipDownFlag: true,
      imgSplicingFlag: false,
      codeText: '',
      //
      zipDownPopover: false,
      showPopover: false

    }
  },
  mounted() {
    this.getAllData()
  },
  methods: {
    onChangeData(key, value) {
      setStorage(key, value)
    },
    webImgSplicing(value) {
      const splicingimgstyle = document.getElementById('splicingimgstyle')
      console.log('currentComics: ', currentComics)
      if (value === true && currentComics.readCssText !== undefined) {
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
      this.$refs.swipe2.swipeTo(val)
    },
    getCode() {
      console.log(this.codeText)
      const a = JSON.parse(this.codeText)
      console.log(a)
    },
    exeFun(flag) {
      this.webImgSplicing(flag)
    },
    getAllData() {
      try {
        this.maxChapterNum = GM_getValue('maxChapterNum')
        this.maxPictureNum = GM_getValue('maxPictureNum')
        this.zipDownFlag = GM_getValue('zipDownFlag')
        this.imgSplicingFlag = GM_getValue('imgSplicingFlag')
      // eslint-disable-next-line no-empty
      } catch (error) {}
      // 获取数据后执行其他方法
      this.exeFun(this.imgSplicingFlag)
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
    }
  }
}
</script>

<style lang="less" scoped>
.setindex {
  display: flex;
  // margin: 20px 15px 30px 15px;
  height: 680px;
  max-height: 680px;
  // justify-content: space-between;

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
    flex-direction: row;
    border-radius: 15px;
    background-color: #ffffff;
    overflow: auto;
    width: 100%;

    .van-cell-group__title {
      color: #78a5ff;
      font-size: 15px;
    }

    .van-cell {
      padding: 10px 1px;
      .cellleftvalue {
        flex: 1;
      }
      .cellrightvalue {
        flex: 0.2 !important;
      }
      // 右侧按钮
      .rightbutton {
        flex-direction: row-reverse;
      }
      .custom-title {
        text-align: left;
      }

      // 修改滑动条
      .rightslider {
        margin: 10px 15px;
        width: 120px;
          // 滑动按钮
          .custom-button {
            width: 20px;
            color: #fff;
            font-size: 10px;
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
    margin-bottom: 20px;
  }

}

</style>

