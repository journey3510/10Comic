<template>
  <div class="setting">

    <van-cell-group title="下载" inset>
      <van-cell label="* 描述信息">
        <template #title>
          <span style="width: 200px" class="custom-title">最大下载数量</span>
        </template>

        <template #right-icon>
          <van-slider
            id="queuenum"
            v-model="queueNum"
            :min="1"
            :max="5"
            style="width: 200px"
            @change="onChange"
          >
            <template #button>
              <div class="custom-button">{{ queueNum }}</div>
            </template>
          </van-slider>
        </template>
        <br>

        <template #label>
          <van-slider
            id="queuenum"
            v-model="queueNum"
            :min="1"
            :max="5"
            style="width: 200px"
            @change="onChange"
          >
            <template #button>
              <div class="custom-button">{{ queueNum }}</div>
            </template>
          </van-slider>
        </template>

      </van-cell>
    </van-cell-group>

  </div>
</template>

<script>

export default {
  name: 'Setting',
  data() {
    return {
      queueNum: 1
    }
  },
  mounted() {
    this.getnum()
  },
  methods: {
    onChange(value) {
      GM_setValue('queueNum', value)
    },
    getnum() {
      this.queueNum = GM_getValue('queueNum')
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  margin: 20px 15px;
  border-radius: 15px;
  background-color: #ffffff;
  overflow: auto;

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

}

</style>

