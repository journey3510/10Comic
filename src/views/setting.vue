<template>
  <div class="setting">

    <van-sidebar id="setitem" v-model="activeKey">
      <van-sidebar-item title="下载" />
      <van-sidebar-item title="说明" />
    </van-sidebar>

    <div id="setcontent">
      qq
    </div>

  </div>
</template>

<script>

export default {
  name: 'Index',
  data() {
    return {
      activeKey: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  margin: 20px 15px;
  border-radius: 15px;
  display: flex;
  height: 670px;
  background-color: #ffffff;
  overflow: auto;

  #setitem {
  margin: 20px 5px;
  width: 120px;
  height: 200px;
  display: flex;
  flex-direction: column;
  border: 0.5px solid #66ccff9e;
  border-radius: 15px;
  // background-color: rgba(235, 233, 233, 0.73);
  .van-sidebar-item {
    background-color:  #f8f8f8;
  }
  .van-sidebar-item--select {
    background-color: #66ccff20;
  }

}

  #setcontent {
    width: 100%;
    border: 1px solid rgba(255, 0, 0, 0.54);
    border-radius: 15px;

    margin: 5px;
  }
}

</style>

