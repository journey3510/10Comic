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
        <template #title>
          <div :style="{display:'flex', lineHeight: '25px'}">下载中
            <van-tag v-if="comicName" class="comicnametag1" type="primary">{{ comicName }}</van-tag>
          </div>
        </template>

        <div id="downlist">
          <div
            v-for="(item,index) in queue.worker"
            :key="index"
            class="downitem"
          >
            <div v-if="item !== undefined ">
              <div class="itemname">
                <span class="custom-title">{{ item.chapterName }}</span>
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
              <span class="custom-title">{{ item.chapterName }}</span>
            </div>
            <van-divider
              :style="{ margin:'11px 0px', padding: '0 0px',height: '1px' }"
            />
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item name="3">
        <template #title>
          <div :style="{display:'flex'}">已下载
            <van-icon
              style="line-height: 25px;margin-left: 10px;"
              name="delete-o"
              color="#EE0000"
              size="20"
              @click.stop="deleteAllHistoryData"
            />
          </div>
        </template>

        <div id="downlist">
          <div
            v-for="(item,index) in historyData"
            :key="index"
            class="downitem"
          >
            <div class="itemname">
              <div>
                <van-tag
                  type="primary"
                  class="comicnametag"
                  @click="jump(item.comicPageUrl)"
                >{{ item.comicName }}</van-tag>
                <span class="custom-title chapterspan" :class="{ 'hasError': item.hasError }">{{ item.chapterName }}</span>
              </div>
              <van-icon :style="{cursor:'pointer'}" name="delete-o" size="18px" @click="deleteHistoryData(index)" />

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
import { getStorage } from '@/config/setup'
import { setLocalData, getLocalData } from '@/utils/index'

import { Dialog } from 'vant'

export default {
  name: 'Down',
  data() {
    return {
      collapseActiveName: ['1', '2', '3'],
      comicName: null,
      queue: {
        'worker': '',
        'list': '',
        'workeredList': ''
      },
      maxChapterNum: 3,
      maxPictureNum: 2,
      zipDownFlag: true,
      historyData: []
    }
  },
  watch: {

  },
  mounted() {
    console.clear()
    this.$bus.$on('selectDown', this.downInit)
  },
  created() {
    this.$bus.$on('getComicName', this.getComicName)
    this.getHistoryData()
  },
  methods: {
    getComicName(value) {
      if (value !== '------') { this.comicName = value }
    },
    async downInit(arr) {
      if (this.queue.worker === '') {
        this.maxChapterNum = await getStorage('maxChapterNum')
        this.maxPictureNum = await getStorage('maxPictureNum')
        this.zipDownFlag = await getStorage('zipDownFlag')
        this.queue = new Queue(this.maxChapterNum, this.maxPictureNum, this.zipDownFlag, this)
      }
      this.queue.addList(arr)
      this.queue.run()
    },
    getHistoryData() {
      this.historyData = JSON.parse(getLocalData('10AppDownHistory') || '[]')
    },
    deleteHistoryData(index) {
      this.historyData.splice(index, 1)
      const data = JSON.stringify(this.historyData)
      setLocalData('10AppDownHistory', data)
    },
    deleteAllHistoryData() {
      Dialog.confirm({
        getContainer: '.card',
        message: '确认全部删除'
      })
        .then(() => {
          this.historyData.splice(0, this.historyData.length)
          setLocalData('10AppDownHistory', '[]')
        })
        .catch(() => {
          // on cancel
        })
    },
    jump(url) {
      window.open(url, '_blank')
      // window.location.href = url
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

.comicnametag1 {
  margin-left: 10px ;
  height: 15px;
  margin-top: 4px;
  display:inline-block;
  max-width: 200px;
  white-space: nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
}

#downlist {
  margin: 10px 0px;
  padding: 5px 5px;
  border-radius: 15px;
  overflow-y: auto;
  max-height: 500px;
  // 下载项
  .downitem {
    // padding: 1px 10px;
    display: flex;
    flex-direction: column;
    .itemname {
      display: flex;
      justify-content: space-between;
      margin: 2px 5px;
      .comicnametag {
        display:inline-block;
        max-width: 55px;
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        cursor: pointer;

      }
      .chapterspan {
        display:inline-block;
        max-width: 200px;
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
      }
      .hasError {
        color: red;
      }
    }

  }
}

</style>
