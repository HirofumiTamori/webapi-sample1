<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <div class="block">
      <div class="input-form">
        <el-form :model="stockForm" :rules="stockRules" ref="stockForm" label-width="120px" class="stock-form">
          <el-form-item label="株価コード" prop="stockCode">
            <el-input type="string" v-model="stockForm.code" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="open-button">
        <el-button plane @click="openURL"> 調べる </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  const fastHTMLParser = require('fast-html-parser')
  const proxyURL = 'http://ec2-52-199-92-184.ap-northeast-1.compute.amazonaws.com:8080'
  const baseURL = 'https://stocks.finance.yahoo.co.jp/stocks/detail/?code='
  
  export default {
    name: 'webapi-sample1',
    methods: {
      openURL () {
        console.log(this)
        this.$http.get(proxyURL + '/' + baseURL + this.stockForm.code)
          .then(response => {
            console.log(response)
            let rawHTML = response.data
            console.log(this.stockForm.code)
            // console.log(rawHTML)
            let root = fastHTMLParser.parse(rawHTML)
            console.log(root)
            console.log(root.querySelector('.yjSt'))
          }).catch(error => { console.log(error) })
      }
    },
    data () {
      return {
        stockForm: {
          code: '6758.T'
        },
        stockRules: {
          code: [
            {
              validator: (rule, value, callback) => {
                console.log(rule)
                if (!value) {
                  return callback(new Error('値を入力してください'))
                }
              },
              trigger: 'change'
            }
          ]
        }
      }
    }
  }
</script>

<style>
  /* CSS */
  .block {
    display: inline-block;
    font-family:  "メイリオ",sans-serif;
    color: #445566;
  }
  .slider {
    width: 50%;
    color: #998800;
  }
  .input-form {
    display: inline-block;
    width: 300px;
  }
  .open-button {
    display: inline-block;
  }
</style>
