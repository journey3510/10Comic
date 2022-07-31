<template>
  <div class="setindex">

    <div id="setpart">
      <van-cell-group id="downpart" title="下载" inset>
        <van-cell label="* 刷新生效" center>
          <template #title>
            <span style="width: 300px" class="custom-title">最大下载章节数</span>
          </template>

          <template #default>
            <van-slider
              v-model="maxChapterNum"
              class="rightslider"
              :min="1"
              :max="5"
              @change="onChangeData('maxChapterNum', maxChapterNum)"
            >
              <template #button>
                <div class="custom-button">{{ maxChapterNum }}</div>
              </template>
            </van-slider>
          </template>
        </van-cell>

        <van-cell label="* 刷新生效" center>
          <template #title>
            <span style="width: 300px" class="custom-title">每章最大下载图片数</span>
          </template>

          <template #default>
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
            </van-slider>
          </template>
        </van-cell>

      </van-cell-group>

      <van-cell-group id="webpart" title="原网站阅读样式修改" inset>
        <van-cell label="去除部分漫画网站图片上下间隔" center>
          <template #title>
            <span class="custom-title">图片拼接</span>

            <van-popover
              v-model="showPopover"
              placement="bottom-start"
              get-container="#webpart"
              :offset="[-2,0]"
              :close-on-click-outside="true"
            >
              <code class="popoverText">建议浏览长条漫画时开启</code>
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
              v-model="imgSplicing"
              class="rightbutton"
              @change="webImgSplicing"
            />
          </template>
        </van-cell>
      </van-cell-group>

    </div>

    <div id="set-bottom">
      <van-button
        :style="{width: '120px',background: '#ee000055'}"
        round
        @click="allInit"
      >全部重置</van-button>

    </div>

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
      imgSplicing: true,
      //
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
      this.onChangeData('imgSplicing', value)
    },
    exeFun(imgSplicing) {
      this.webImgSplicing(imgSplicing)
    },
    getAllData() {
      try {
        this.maxChapterNum = GM_getValue('maxChapterNum')
        this.maxPictureNum = GM_getValue('maxPictureNum')
        this.imgSplicing = GM_getValue('imgSplicing')
      // eslint-disable-next-line no-empty
      } catch (error) {}
      // 获取数据后执行其他方法
      this.exeFun(this.imgSplicing)
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

<style lang="scss" scoped>
.setindex {
  display: flex;
  flex-direction: column;
  margin: 20px 15px 30px 15px;
  height: 680px;
  max-height: 680px;
  justify-content: space-between;

  #setpart {
    flex-direction: row;
    border-radius: 15px;
    background-color: #ffffff;
    overflow: auto;

    .van-cell-group__title {
      color: #78a5ff;
      font-size: 15px;
    }

    .van-cell {
      padding: 10px 1px;
      .custom-title {

      }

      // 修改滑动条
      .rightslider {
        margin: 10px 15px;
        width: 150px;
          // 滑动按钮
          .custom-button {
            width: 26px;
            color: #fff;
            font-size: 10px;
            line-height: 18px;
            text-align: center;
            background-color: #ee0a24;
            border-radius: 100px;
          }
       }

      // 右侧按钮
      .rightbutton {
        flex-direction: row-reverse;
      }

      .popoverText {
        display: block;
        margin: 10px 10px;
        background-color: red !important;
        // margin-left: 30px;
        padding: 10px 10px;
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

