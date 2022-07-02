<template>
  <div id="downcontext">

    <van-collapse
      v-model="collapseActiveName"
      accordion
    >
      <van-collapse-item
        title="标题1"
        name="1"
      >
        <div id="downlist">
          <div
            v-for="(item,index) in list"
            :key="index"
            class="downitem"
          >

            <div class="itemname">
              <span class="custom-title">{{ item.name }}</span>
              <van-icon name="down" size="18px" />
            </div>
            <van-progress
              ref="progress"
              :percentage="ee"
              style="width: 100%;margin-top:5px;"
              pivot-color="#66ccff"
              color="linear-gradient(to right, #66ccff22, ##66ccff)"
            />
            <van-divider
              :style="{ margin:'11px 0px', color: '#1989fa', borderColor: '#1989fa', padding: '0 0px',height: '1px' }"
            />
          </div>
        </div>

      </van-collapse-item>
      <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
      <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
    </van-collapse>

  </div>
</template>

<script>
import Queue from '@/utils/queue'
import { down, getHtml } from '@/utils/index'

export default {
  name: 'Down',
  data() {
    return {
      ee: 50,
      collapseActiveName: '1',
      list: []
    }
  },
  mounted() {
    this.$bus.$on('selectDown', this.downInit)
  },
  methods: {
    downInit(arr) {
      console.log('arr: ', arr)
      const queue = new Queue(2)
      queue.addList([
        [down, undefined, '0001', 3.02, 'ds1'],
        [down, undefined, '0002', 5, 'ds2'],
        [down, undefined, '0003', 1, 'ds3']
      ])
      console.log('queue: ', queue)
      queue.run()
    }

  }
}
</script>

<style lang="scss" scoped>
#downcontext {
  margin: 15px 15px;
  border-radius: 15px;
  overflow: hidden;
}

#downlist {
  margin: 10px 0px;
  padding: 5px 5px;
  // border: 1px solid black;
  // background-color: #fff;
  border-radius: 15px;
  border: 1px solid black;
  overflow-y: auto;
  max-height: 500px;
  // 下载项
  .downitem {
    padding: 1px 10px;
    display: flex;
    flex-direction: column;
    .itemname {
      display: flex;
      justify-content: space-between;
      margin: 2px 5px;
    }
    hr {
      margin-top: 15px;
      margin-bottom: 5px;
      border-color: #eeeeee;
      scale: 0.1;
    }

  }
}

</style>
