<template>
  <div id="downcontext">

    <van-collapse
      v-model="collapseActiveName"
    >
      <!-- accordion -->
      <van-collapse-item
        title="下载中"
        name="1"
      >
        <div id="downlist">
          <div
            v-for="(item,index) in queue.worker"
            :key="index"
            class="downitem"
          >
            <div v-if="item !== undefined ">
              <div class="itemname">
                <span class="custom-title">{{ item.name }}</span>
                <van-icon name="down" size="18px" />
              </div>
              <van-progress
                ref="progress"
                :percentage="item.xx"
                style="width: 100%;margin-top:5px;"
                pivot-color="#66ccff"
                color="linear-gradient(to right, #66ccff22, ##66ccff)"
              />
              <van-divider
                :style="{ margin:'11px 0px', color: '#1989fa', borderColor: '#1989fa', padding: '0 0px',height: '1px' }"
              />
            </div>
          </div>

        </div>

      </van-collapse-item>
      <van-collapse-item title="待下载" name="2">
        <div id="downlist">

          <div
            v-for="(item,index) in queue.list"
            :key="index"
            class="downitem"
          >
            <div class="itemname">
              <span class="custom-title">{{ item[4] }}</span>
              <van-icon name="down" size="18px" />
            </div>
            <van-divider
              :style="{ margin:'11px 0px', color: '#1989fa', borderColor: '#1989fa', padding: '0 0px',height: '1px' }"
            />
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="已下载" name="3">
        <div id="downlist">

          <div
            v-for="(item,index) in queue.workeredList"
            :key="index"
            class="downitem"
          >
            <div class="itemname">
              <span class="custom-title">{{ item }}</span>
            </div>
            <van-divider
              :style="{ margin:'11px 0px', color: '#1989fa', borderColor: '#1989fa', padding: '0 0px',height: '1px' }"
            />
          </div>

        </div>
      </van-collapse-item>
    </van-collapse>

  </div>
</template>

<script>
import Queue from '@/utils/queue'
import { downtest } from '@/utils/index'

export default {
  name: 'Down',
  data() {
    return {
      ee: 20,
      collapseActiveName: ['1', '2', '3'],
      list: [],
      downingList: [],
      downedList: [],
      waitingDownList: [
        [downtest, undefined, 1, 10, 'ds11', 'urllxxxxxxxxxxxxxxxx'],
        [downtest, undefined, 2, 9, 'ds22', 'urllxxeeeeeeeexx'],
        [downtest, undefined, 3, 6, 'ds33', 'urllxmmmmmmmmmm'],
        [downtest, undefined, 4, 15, 'dd44', 'urllxmmmmmmmmmm'],
        [downtest, undefined, 5, 9, 'dd55', 'urllxmmmmmmmmmm'],
        [downtest, undefined, 6, 13, 'dd66', 'urllxmmmmmmmmmm']
      ],

      queue: null
    }
  },
  mounted() {
    console.clear()
    this.$bus.$on('selectDown', this.downInit)
    this.downInit(this.waitingDownList)
  },
  created() {
    this.$bus.$emit('selectDown', [])
  },
  methods: {
    downInit(arr) {
      console.log('arr: ', arr)
      this.waitingDownList = arr

      this.queue = new Queue(3)

      this.queue.addList(this.waitingDownList)
      // console.log('queue: ', this.queue)
      console.log('this.queue.worker[0]: ', this.queue.worker[0])
      // console.log('this.queue.workeredList: ', this.queue.workeredList)
      this.queue.run()

      // setTimeout(() => {
      //   this.queue.pause()
      // }, 1000)
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
  // border: 1px solid black;
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
