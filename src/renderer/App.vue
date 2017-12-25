<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <div class="block">
      <h1> Hello ! </h1>
      <span class="slider">
        <el-slider v-model="valueSlider"></el-slider>
      </span>
    </div>
    <div class="block">
      <span class="slider">
        <el-slider v-model="valueSlider2"></el-slider>
      </span>
    </div>
    <div class="block">
      <el-button plain @click="openURL">HTTP Access</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'webapi-sample1',
    methods: {
      openURL () {
        this.$http.get('http://localhost:8080/http://www.yahoo.co.jp')
          .then(response => {
            console.log(response.data)
          })
      }
    },
    data () {
      return {
        valueSlider: 50,
        valueSlider2: 50
      }
    }
  }
</script>

<style>
  /* CSS */
  .block {
    font-family:  "メイリオ",sans-serif;
    color: #445566;
  }
  .slider {
    width: 50%;
    color: #998800;
  }
</style>
