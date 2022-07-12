<template>
  <div class="app">
    <div class="card" :class="{ 'card--hide': isHide }">
      <van-nav-bar id="border-top-set" :title="titles[this.active]" />

      <van-swipe
        ref="swipe"
        class="my-swipe"
        indicator-color="white"
        :touchable="false"
        style="cursor: default;"
        :duration="5"
        :initial-swipe="active"
        :show-indicators="false"
      >
        <van-swipe-item class="swipeitem">
          <Home />
        </van-swipe-item>
        <van-swipe-item class="swipeitem">
          <Table />
        </van-swipe-item>
        <van-swipe-item class="swipeitem">
          <Down />
        </van-swipe-item>
        <van-swipe-item class="swipeitem">
          <Setting />
        </van-swipe-item>
      </van-swipe>

      <div class="app-container ">
        <van-tabbar
          id="border-bottom-set"
          v-model="active"
          style="position: absolute;"
          active-color="#ee0000"
          inactive-color="#000"
        >
          <van-tabbar-item icon="home-o" />
          <van-tabbar-item icon="todo-list-o" />
          <van-tabbar-item icon="underway-o" />
          <van-tabbar-item icon="setting-o" />
        </van-tabbar>
      </div>

      <!-- 按钮 -->
      <div class="card__btn" @click="hide">
        <svg
          t="1589962875590"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          p-id="2601"
        >
          <path
            d="M730.020653 1018.946715l91.277028-89.978692a16.760351 16.760351 0 0 0 5.114661-11.803064 15.343983 15.343983 0 0 0-5.114661-11.803064l-400.123871-393.435467L821.691117 118.254899a17.075099 17.075099 0 0 0 0-23.606129L730.020653 4.670079a17.232473 17.232473 0 0 0-23.999564 0L202.030255 500.08402a16.445603 16.445603 0 0 0-4.721226 11.803064 15.265296 15.265296 0 0 0 5.114661 11.803064l503.597399 495.413941a17.153786 17.153786 0 0 0 23.999564 0z m0 0"
            fill="#FFFFFF"
            p-id="2602"
          />
        </svg>
      </div>
    </div>

    <van-button
      id="thebtn"
      icon="plus"
      type="primary"
      @click="onChange"
    />

  </div>
</template>

<script>
import Home from '@/views/home.vue'
import Table from '@/views/table.vue'
import Setting from '@/views/setting.vue'
import Down from '@/views/down.vue'

import { AppName, AppVersion } from './config'
import { matchWeb } from './utils/comics'

export default {
  name: 'App',
  components: {
    Home, Table, Down, Setting
  },
  data() {
    return {
      AppName,
      AppVersion,
      show: true,
      isHide: true,
      active: 1,
      titles: ['漫画网站', '选择章节', '下载', '设置'],
      comicInfo: {}
    }
  },
  computed: {
    current: function() {
      return this.active
    }
  },
  watch: {
    active(val) {
      this.$refs.swipe.swipeTo(val)
    }
  },
  created() {
    matchWeb(window.location.href)
  },
  mounted() {
    this.$bus.$on('changTab', (val) => { this.active = val })
  },
  methods: {
    showContext() {
      this.show = !this.show
    },
    hide() {
      this.isHide = !this.isHide
    },
    onChange() {

    }
  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}

.custom-indicator {
  position: absolute;
  height: 700px;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
}

// #thebtn {
//   position: fixed;
//   top: 150px;
//   right: 600px;
//   z-index: 90000 !important;
// }
</style>

<style lang="scss" scoped>
.card {
  position: fixed;
  z-index: 9999;
  right: 0;
  top: 50%;
  height: 800px;
  width: 420px;
  background-color: #f8f8f8;
  transform: translateY(-50%);
  border: solid 1px #66ccffee;
  border-radius: 25px ;
  transition: all 0.5s;
  box-shadow: 2px 3px 3px 2px #66ccff55;
}
.card__btn {
  transition: all 0.5s;
  border-radius: 30px 0 0 30px;
  width: 30px;
  height: 60px;
  background-color: #66ccff55;
  cursor: pointer;
  position: absolute;
  right: 420px;
  top: 50%;
  // transform: translateY(-50%);
  text-align: center;
  svg {
    height: 20px;
    width: 20px;
    position: absolute;
    right: 5px;
    top: 20px;
    transition: all 0.5s;
      transform: rotate(180deg);
  }
}
.card--hide {
  right: -415px;
  .card__btn {
    border-radius: 0 30px 30px 0;
    right: 420px;
      transform: rotate(180deg);
    svg {
    }
  }
}

#border-bottom-set {
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  overflow: hidden;
}

#border-top-set {
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  overflow: hidden;
}

.swipeitem {
  height: 697px;
  padding-bottom: 5px;
}

.test {
  position: absolute;
  position: relative;
 cursor: default;
 height: 600px;
}
</style>
