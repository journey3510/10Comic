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
          t="1663828267105"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          p-id="2601"
        >
          <path d="M312.888889 995.555556c-17.066667 0-28.444444-5.688889-39.822222-17.066667-22.755556-22.755556-17.066667-56.888889 5.688889-79.644445l364.088888-329.955555c11.377778-11.377778 17.066667-22.755556 17.066667-34.133333 0-11.377778-5.688889-22.755556-17.066667-34.133334L273.066667 187.733333c-22.755556-22.755556-28.444444-56.888889-5.688889-79.644444 22.755556-22.755556 56.888889-28.444444 79.644444-5.688889l364.088889 312.888889c34.133333 28.444444 56.888889 73.955556 56.888889 119.466667s-17.066667 85.333333-51.2 119.466666l-364.088889 329.955556c-11.377778 5.688889-28.444444 11.377778-39.822222 11.377778z" p-id="2134" fill="#ee000088" />
        </svg>
      </div>
    </div>

    <Search />
    <van-button
      id="thebtn"
      icon="plus"
      @click="test"
    />
  </div>
</template>

<script>
import Home from '@/views/home.vue'
import Table from '@/views/table.vue'
import Setting from '@/views/setting.vue'
import Down from '@/views/down.vue'

import Search from '@/components/search.vue'

import { matchWeb } from './utils/comics'
import { request, downFile } from './utils/index'

export default {
  name: 'App',
  components: {
    Home, Table, Down, Setting, Search
  },
  data() {
    return {
      isHide: true,
      showSearchPage: false,
      active: 1,
      titles: ['漫画网站', '加载', '下载', '设置'],
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
    this.Init()
  },
  mounted() {
    this.$bus.$on('changTab', (val) => { this.active = val })
  },
  methods: {
    hide() {
      this.isHide = !this.isHide
    },
    async Init() {
      matchWeb(window.location.href)
    },

    async test() {
      const url = 'http://image.mangabz.com/1/72/251763/8_1794.jpg?cid=251763&key=f097f04d3e850de195274010ec127e66&uk='
      // eslint-disable-next-line no-undef
      GM_download({
        url,
        name: 'ee.jpg',
        // headers: {
        //   referer: 'http://www.mangabz.com/'
        // },
        onload: function(L) {
          console.log('L: ', L)
        },
        onerror: function(e) {

        },
        onprogress: function(e) {
          console.log('eonprogress: ', e)
        },

        ontimeout: function() {

        }
      })
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
#thebtn {
  position: fixed;
  top: 150px;
  right: 600px;
  z-index: 999999 !important;
}
</style>

<style lang="less" scoped>
.card {
  position: fixed;
  z-index: 999999 !important;
  right: 0;
  top: 50%;
  height: @appHeight;
  width: @appWidth !important;
  background-color: #f8f8f8;
  transform: translateY(-50%);
  border: solid 1px #66ccffee;
  border-radius: 25px ;
  transition: all 0.5s;
  box-shadow: 2px 3px 3px 2px #66ccff55;
  #border-top-set {
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    overflow: hidden;
  }
  #border-bottom-set {
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
    overflow: hidden;
  }
  .swipeitem {
    height: 697px;
    padding-bottom: 5px;
  }
}
.card__btn {
  transition: all 0.5s;
  border-radius: 30px 0 0 30px;
  width: 30px;
  height: 60px;
  background-color: #66ccff96;
  cursor: pointer;
  position: absolute;
  right: @appWidth;
  top: 50%;
  text-align: center;
  svg {
    height: 20px;
    width: 20px;
    position: absolute;
    right: 5px;
    top: 20px;
    transition: all 0.5s;
    color: @lingColor;
  }
}
.card--hide {
  right:  -@appWidth + 5px;
  .card__btn {
    right: @appWidth;
    svg {
      transform: rotate(180deg);
    }
  }
}

.test {
  position: absolute;
  position: relative;
  cursor: default;
  height: 600px;
}
</style>
