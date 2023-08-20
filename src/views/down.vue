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
            <van-tag v-if="comicName" class="comicnametag1">{{ comicName }}</van-tag>
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
                <span class="custom-title">{{ item.downChapterName }}</span>
              </div>

              <van-progress
                ref="progress"
                :percentage="item.progress"
                style="width: 100%;margin-top:10px;"
                pivot-color="#66ccff"
                color="linear-gradient(to right, #66ccff22, ##66ccff)"
              />
              <van-divider
                :style="{ margin:'13px 0px', padding: '0 0px',height: '1px' }"
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
              <span class="custom-title">{{ item.downChapterName }}</span>
            </div>
            <van-divider
              :style="{ margin:'8px 0px', padding: '0 0px',height: '1px' }"
            />
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item name="3">
        <template #title>
          <div :style="{display:'flex'}">
            <span :title="currentDomain">
              下载记录
              <van-icon name="info-o" color="#adadad" />
            </span>
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
              <div style="display: flex;">
                <van-tag
                  :title="item.comicName"
                  class="comicnametag"
                  @click="jump(item.comicPageUrl)"
                >{{ item.comicName }}</van-tag>
                <span class="custom-title chapterspan" :class="{ 'hasError': item.hasError }">{{ item.downChapterName }}</span>
              </div>
              <van-icon :style="{cursor:'pointer'}" name="delete-o" size="18px" @click="deleteHistoryData(index, item.id)" />

            </div>
            <van-divider
              :style="{ margin:'8px 0px', padding: '0 0px',height: '1px' }"
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
import { getdomain } from '@/utils/index'

import { Dialog } from 'vant'

export default {
  name: 'Down',
  data() {
    return {
      collapseActiveName: ['1', '2', '3'],
      comicName: null,
      currentDomain: '当前记录 ' + getdomain(),
      queue: {
        'worker': '',
        'list': '',
        'workeredList': ''
      },
      maxChapterNum: 3,
      maxPictureNum: 2,
      imgIndexBitNum: 3,
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
    downInit(arr) {
      if (this.queue.worker === '') {
        this.maxChapterNum = getStorage('maxChapterNum')
        this.maxPictureNum = getStorage('maxPictureNum')
        this.imgIndexBitNum = getStorage('imgIndexBitNum')
        this.queue = new Queue(this.maxChapterNum, this.maxPictureNum, this.imgIndexBitNum, this)
      }
      this.queue.addList(arr)
      this.queue.run()
    },
    getHistoryData() {
      const data = localStorage.getItem('ylComicDownHistory')
      this.historyData = JSON.parse(data || '[]')
    },
    deleteHistoryData(index, id) {
      this.historyData.splice(index, 1)
      let data = localStorage.getItem('ylComicDownHistory')
      let historyData = JSON.parse(data || '[]')
      historyData = historyData.filter((item) => item.id !== id)
      data = JSON.stringify(historyData)
      localStorage.setItem('ylComicDownHistory', data)
    },
    deleteAllHistoryData() {
      Dialog.confirm({
        getContainer: '.card',
        message: '确认全部删除'
      })
        .then(() => {
          this.historyData.splice(0, this.historyData.length)
          localStorage.setItem('ylComicDownHistory', '[]')
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

<style lang="less" scoped>
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
  background-color: @lingColor !important;
}

#downlist {
  margin: 10px 5px;
  padding: 5px 0px;
  border-radius: 15px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 500px;
  // 下载项
  .downitem {
    display: flex;
    flex-direction: column;
    width: 98%;

    .itemname {
      display: flex;
      justify-content: space-between;
      margin: 2px 5px;
      .comicnametag {
        display: inline-block;
        width:60px;
        max-width: 60px;
        text-align: center;
        height: 18px;
        line-height: 18px;
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        cursor: pointer;
      }
      .chapterspan {
        display: inline-block;
        margin-left: 10px;
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
