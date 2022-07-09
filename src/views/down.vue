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

              <div>
                {{ queue.worker[index][4] }}
              </div>
              <van-progress
                ref="progress"
                :percentage="item.progress"
                style="width: 100%;margin-top:5px;"
                pivot-color="#66ccff"
                color="linear-gradient(to right, #66ccff22, ##66ccff)"
              />
              <van-divider
                :style="{ margin:'11px 0px', padding: '0 0px',height: '1px' }"
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
              <span class="custom-title">{{ item.name }}</span>
            </div>
            <van-divider
              :style="{ margin:'11px 0px', padding: '0 0px',height: '1px' }"
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
              :style="{ margin:'11px 0px', padding: '0 0px',height: '1px' }"
            />
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>

  </div>
</template>

<script>
import Queue from '@/utils/queue'

export default {
  name: 'Down',
  data() {
    return {
      collapseActiveName: ['1', '2', '3'],
      queue: [],
      queueNum: 2
    }
  },
  watch: {

  },
  mounted() {
    console.clear()
    this.$bus.$on('selectDown', this.downInit)
    this.getnum()
  },
  created() {
  },
  methods: {
    downInit(arr) {
      if (this.queue.length === 0) {
        this.queue = new Queue(this.queueNum)
      }
      this.queue.addList(arr)
      this.queue.run()
    },
    getnum() {
      this.queueNum = GM_getValue('queueNum')
    }

  }
}
</script>

<style lang="scss" scoped>
#downcontext {
  margin: 15px 15px;
  max-height: 680px;
  border-radius: 15px;
  overflow: auto;
}

#downlist {
  margin: 10px 0px;
  padding: 5px 5px;
  border-radius: 15px;
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

  }
}

</style>
