<template>
  <div class="import-page">
    <textarea
      id="codeTextarea"
      ref="codeTextarea"
      v-model="codeText"
      style="resize:none;"
      :style="{width: '97%',height: '92%'}"
    />
    <van-button
      size="mini"
      @click="getCode"
    >确定</van-button>
  </div>
</template>

<script>
import { getStorage, setStorage } from '@/config/setup'
import { Toast } from 'vant'

export default {
  name: 'Importpage',
  data() {
    return {
      codeText: ''
    }
  },
  methods: {
    getCode() {
      try {
        // eslint-disable-next-line no-eval
        const code = eval(this.codeText)
        const userWebInfo = getStorage('userWebInfo')
        if (code.length > 0) {
          code.forEach(element => {
            userWebInfo.unshift(element)
          })
        }
        setStorage('userWebInfo', userWebInfo)
        this.$bus.$emit('getWeb')
        Toast({
          message: '已导入',
          getContainer: '.card',
          position: 'bottom'
        })
        setTimeout(() => {
          this.$bus.$emit('changeSetupFirstPage')
        }, 1000)
      } catch (error) {
        Toast({
          message: '请粘贴正确JSON文字',
          getContainer: '.card',
          position: 'bottom'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.import-page {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  height: 620px;
  max-height: 620px;
  justify-content: space-between;
  #codeTextarea {
    border-color: @yiColor;
    border-radius: 8px;
    padding: 2px;
  }
}
</style>
