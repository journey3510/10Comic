<template>
  <div class="setindex">

    <div id="setpart">
      <van-cell-group title="下载" inset>
        <van-cell label="* 刷新生效">
          <template #title>
            <span style="width: 300px" class="custom-title">最大下载数量</span>
          </template>

          <template #right-icon>
            <van-slider
              id="queuenum"
              v-model="maxChapterNum"
              :min="1"
              :max="5"
              style="width: 150px"
              @change="onChange"
            >
              <template #button>
                <div class="custom-button">{{ maxChapterNum }}</div>
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
import { setinit } from '@/config/setup'
import { Dialog } from 'vant'

export default {
  name: 'Setting',
  data() {
    return {
      maxChapterNum: 1
    }
  },
  mounted() {
    this.getnum()
  },
  methods: {
    onChange(value) {
      GM_setValue('maxChapterNum', value)
    },
    getnum() {
      try {
        this.maxChapterNum = GM_getValue('maxChapterNum')
      // eslint-disable-next-line no-empty
      } catch (error) {}
    },
    allInit() {
      Dialog.confirm({
        getContainer: '.card',
        message: '确认重置'
      })
        .then(() => {
          setinit()
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
  }

  #queuenum {
    margin: 10px 0;
  }

  .custom-button {
    width: 26px;
    color: #fff;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
    background-color: #ee0a24;
    border-radius: 100px;
  }

  #set-bottom {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

}

</style>

