<template>
  <div id="comiclist">
    <!-- 编辑选项 -->
    <div id="editItem">
      <van-button
        type="primary"
        size="mini"
        @click="selectAll"
      >全选</van-button>

      <input v-model="startIndex" type="number" min="1" max=""> - <input type="number" :min="startIndex" :max="endIndex">
      <van-button
        type="primary"
        size="mini"
        @click="scopeSelect"
      >范围选择</van-button>
    </div>

    <!-- <van-divider /> -->
    <van-divider
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 15px',height: '10px' }"
    >文字</van-divider>

    <!-- 列表为空 -->
    <div v-if="!showSelectList">
      <van-empty description="描述文字">
        <van-button
          style="width:120px;"
          round
          type="primary"
          class="bottom-button"
          @click="getSelectList"
        > 加载 </van-button>
      </van-empty>
    </div>

    <!-- 展示列表 -->
    <div
      v-if="showSelectList"
      id="select-list"
      v-loading="false"
    >
      <van-cell-group
        style="border-radius: 25px;"
        inset
      >
        <van-cell
          v-for="(item,index) in list"
          :key="index"
          :title="item.name"
        >
          <template #right-icon>
            <!-- <van-icon  name="search" class="search-icon" /> -->
            <van-checkbox v-model="item.check" class="selectChapter" icon-size="24px" @click="radioSelect" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

  </div>
</template>

<script>

export default {
  name: 'Table',
  data() {
    return {
      startIndex: 1,
      endIndex: 10,

      showSelectList: false,

      list: [
        { name: 11, check: false },
        { name: 11, check: false },
        { name: 11, check: false },
        { name: 11, check: false },
        { name: 11, check: false },
        { name: 11, check: false },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true },
        { name: 11, check: true }
      ]
    }
  },
  methods: {
    selectAll() {
      this.list.forEach(element => {
        element.check = true
      })
    },
    radioSelect() {
      console.log(this.list)
    },
    scopeSelect() {

    },
    getSelectList() {
      this.showSelectList = !this.showSelectList
    },
    onChange(index) {
      console.log('index: ', index)
      // Toast('当前 Swipe 索引：' + index)
    }
  }
}
</script>

<style lang="scss" scoped>
#comiclist {
  margin-top:  15px;
  // padding:  15px 15px;
  border-radius: 15px;
  position: relative;
  height: 650px;
}

#select-list {
  height: 500px;
  overflow-y:auto;

}

#editItem {
  padding: 5px;
  display: flex;
  flex-wrap: wrap;
}

input {
  margin-left: 5px;
  margin-right: 5px;
  width: 50px;
}
</style>
