<template>
  <div class="setindex">

    <div id="setpart">
      <van-cell-group title="下载" inset>
        <van-cell label="* 刷新生效">
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

          <div class="custom-button">{{ dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd }}</div>

        </van-cell>

        <van-cell label="* 刷新生效">
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

          <br>
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
import { setinit, setStorage } from '@/config/setup'
import { Dialog } from 'vant'

export default {
  name: 'Setting',
  data() {
    return {
      maxChapterNum: 1,
      maxPictureNum: 2
    }
  },
  mounted() {
    this.getAllData()
  },
  methods: {
    onChangeData(key, value) {
      setStorage(key, value)
    },
    getAllData() {
      try {
        this.maxChapterNum = GM_getValue('maxChapterNum')
      // eslint-disable-next-line no-empty
      } catch (error) {}
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
    .van-cell {
      padding: 10px 1px;

      .rightslider {
        margin: 10px 15px;
        width: 150px;

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
    }
  }

  #set-bottom {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

}

</style>

