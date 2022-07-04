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
              <!-- :percentage="item.progress" -->
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
              <span class="custom-title">{{ item.name }}</span>
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

export default {
  name: 'Down',
  data() {
    return {
      ee: 20,
      collapseActiveName: ['1', '2', '3'],
      list: [1, 2, 2, 2, 2, 2, 2, 2],
      downingList: [],
      downedList: [],
      waitingDownList:
      [
        {
          'name': '第826话 星域之门（下）（P）',
          'urls': 'http://www.kmwu6.com/16177/1045956.html',
          time: 5,
          progress: 20,
          imgs: [

            'https://i0.hdslb.com/bfs/album/bd8e36b1f93e4efb51ae1544a04b8d2eb559819d.jpg@1139w.webp',

            'https://i0.hdslb.com/bfs/album/4fe2af34cae57a5cb742fee6c1a647237188c298.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/5b1854ff6a03889e1b998fb445c97a2b1d2cb84b.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/0785528d75711812f8b23fdd4718cc44a10b9812.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/37dc52ecff948e6a71ae45c642f598b87766a2fb.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/new_dyn/16cf84189faa58cfae28cd389a627f8d36081646.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/new_dyn/7e0e9ae370e7dcd8a1dcbf837a1a01bb36081646.jpg@1139w.webp'
          ]
        },
        {
          'name': '第825话 星域之门（上）（P）',
          'urls': 'http://www.kmwu6.com/16177/1045955.html',
          time: 6,
          progress: 20,
          imgs: [
            'https://i0.hdslb.com/bfs/new_dyn/2d4a8def12be9eefa3983095f2ea6f4336081646.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/bd8e36b1f93e4efb51ae1544a04b8d2eb559819d.jpg@1139w.webp',
            // 'https://w.wallhaven.cc/full/k7/wallhaven-k7q9m7.png',
            'https://i0.hdslb.com/bfs/album/4fe2af34cae57a5cb742fee6c1a647237188c298.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/5b1854ff6a03889e1b998fb445c97a2b1d2cb84b.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/0785528d75711812f8b23fdd4718cc44a10b9812.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/37dc52ecff948e6a71ae45c642f598b87766a2fb.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/new_dyn/16cf84189faa58cfae28cd389a627f8d36081646.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/new_dyn/7e0e9ae370e7dcd8a1dcbf837a1a01bb36081646.jpg@1139w.webp'
          ]
        },
        {
          'name': '1 误会？（下）（P）',
          'urls': 'http://www.kmwu6.com/16177/1041746.html',
          time: 4,
          progress: 20,
          imgs: [
            'https://i0.hdslb.com/bfs/new_dyn/2d4a8def12be9eefa3983095f2ea6f4336081646.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/4fe2af34cae57a5cb742fee6c1a647237188c298.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/5b1854ff6a03889e1b998fb445c97a2b1d2cb84b.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/0785528d75711812f8b23fdd4718cc44a10b9812.jpg@1139w.webp',

            'https://i0.hdslb.com/bfs/new_dyn/16cf84189faa58cfae28cd389a627f8d36081646.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/new_dyn/7e0e9ae370e7dcd8a1dcbf837a1a01bb36081646.jpg@1139w.webp'
          ]
        },
        {
          'name': '2 星域之门（下）（P）',
          'urls': 'http://www.kmwu6.com/16177/1045956.html',
          time: 5,
          progress: 20,
          imgs: [
            'https://i0.hdslb.com/bfs/new_dyn/2d4a8def12be9eefa3983095f2ea6f4336081646.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/bd8e36b1f93e4efb51ae1544a04b8d2eb559819d.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/new_dyn/e85b85af2726b734dbb9ef1d97e664f036081646.jpg@1139w.webp',
            'https://w.wallhaven.cc/full/k7/wallhaven-k7v9yq.png',
            'https://i0.hdslb.com/bfs/album/5b1854ff6a03889e1b998fb445c97a2b1d2cb84b.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/0785528d75711812f8b23fdd4718cc44a10b9812.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/album/37dc52ecff948e6a71ae45c642f598b87766a2fb.jpg@1139w.webp'

          ]
        },
        {
          'name': '3 星域之门（上）（P）',
          'urls': 'http://www.kmwu6.com/16177/1045955.html',
          time: 2,
          progress: 20,
          imgs: [
            'https://i0.hdslb.com/bfs/new_dyn/2d4a8def12be9eefa3983095f2ea6f4336081646.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/new_dyn/16cf84189faa58cfae28cd389a627f8d36081646.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/new_dyn/16cf84189faa58cfae28cd389a627f8d36081646.jpg@1139w.webp',
            'https://i0.hdslb.com/bfs/new_dyn/16cf84189faa58cfae28cd389a627f8d36081646.jpg@1139w.webp',
            'https://w.wallhaven.cc/full/pk/wallhaven-pkgkkp.png',

            'https://i0.hdslb.com/bfs/new_dyn/7e0e9ae370e7dcd8a1dcbf837a1a01bb36081646.jpg@1139w.webp'
          ]
        },
        {
          'name': '第824话 误会？（下）（P）',
          'urls': 'http://www.kmwu6.com/16177/1041746.html',
          time: 3,
          progress: 20,
          imgs: [
            'https://i0.hdslb.com/bfs/new_dyn/16cf84189faa58cfae28cd389a627f8d36081646.jpg@1139w.webp',

            'https://images2.alphacoders.com/526/thumb-1920-526200.jpg'
            // 'https://w.wallhaven.cc/full/9m/wallhaven-9mkydk.jpg'

          ]
        }
      ],
      queue: {}

    }
  },
  watch: {
    data1: {
      handler(newName, oldName) {
        console.log('obj.a changed')
      }
      // immediate: true
      // deep: true
    }
  },
  mounted() {
    console.clear()
    this.$bus.$on('selectDown', this.downInit)

    this.downInit(this.waitingDownList)
  },
  created() {
  },
  methods: {
    downInit(arr) {
      console.log('arr: ', arr)
      this.list = arr
      this.queue = new Queue(2)

      this.queue.addList(this.list)
      this.queue.run()
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
