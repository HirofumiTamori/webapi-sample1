<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <div class="block">
      <div class="input-form" id="company">
        <el-form :model="stockForm" ref="stockForm" label-width="120px" class="stock-form">
          <el-form-item label="会社名" prop="stockName">
            <el-input type="string" v-model="stockForm.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="input-form" id="code">
        <el-form ::model="stockForm" ref="stockForm" label-width="120px" class="stock-form">
          <el-form-item label="株価コード" prop="stockCode">
            <el-input type="string" v-model="stockForm.code" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="open-button">
        <el-button plane type="primary" @click="dbQuery"> 調べる </el-button>
      </div>
      <div class="stock-price">
        <h1> {{stockPrice}}円　(前日比{{stockDiff}}) </h1>
      </div>
    </div>
  </div>
</template>

<script>
  const fastHTMLParser = require('fast-html-parser')
  const proxyURL = 'http://ec2-52-199-92-184.ap-northeast-1.compute.amazonaws.com:8080'
  const baseURL = 'https://stocks.finance.yahoo.co.jp/stocks/detail/?code='
  const Database = require('nedb')
  const companyListDB = new Database()
  const dbData = require('./db/stocklist.json')
  companyListDB.insert(dbData) // Set up database content

  export default {
    name: 'webapi-sample1',
    methods: {
      openURL () {
        console.log(this.stockForm.code)
        this.$http.get(proxyURL + '/' + baseURL + this.stockForm.code + '.T')
          .then(response => {
            const rawHTML = response.data
            const root = fastHTMLParser.parse(rawHTML)
            const up = root.querySelector('.icoUpGreen')
            const dn = root.querySelector('.icoDownRed')
            const nc = root.querySelector('.icoNoChange')
            if (up) {
              this.stockDiff = up.firstChild.rawText
            }
            if (dn) {
              this.stockDiff = dn.firstChild.rawText
            }
            if (nc) {
              this.stockDiff = nc.firstChild.rawText
            }
            const td = root.querySelectorAll('.stoksPrice')
            this.stockPrice = td[1].firstChild.rawText
          }).catch(error => { console.log(error) })
      },
      dbQuery () {
        const h = this.$createElement

        console.log(this.stockForm.name)
        companyListDB.find(
          {銘柄名: new RegExp(this.stockForm.name + '.*', 'i')})
          .sort({銘柄名: 1}).exec((err, doc) => {
            if (!err) {
              if (doc.length >= 1) {
                this.stockResultsDoc = doc
                console.log(doc.length)
                console.log(doc[0].銘柄コード)
                this.stockForm.code = doc[0].銘柄コード
                this.stockForm.name = doc[0].銘柄名
                this.openURL()
              } else {
                console.log('エラー')
                const errMsg = '"' + this.stockForm.name + '"' + 'が見つかりません'
                this.$notify({
                  title: 'エラー',
                  message: h('i', {style: 'color: red'}, errMsg),
                  duration: 1000
                })
              }
            }
          })
      }
    },
    data () {
      return {
        stockPrice: '---',
        stockDiff: '---',
        stockForm: {
          name: 'ソニー',
          code: '6758' // ソニー株価番号
        },
        stockFind: '',
        stockResultsDoc: ''
      }
    }
  }
</script>

<style>
  /* CSS */
  .block {
    font-family:  "メイリオ","ヒラギノ角ゴ",sans-serif;
    color: #445566;
  }
  .input-form#company{
    display: inline-block;
    width: 450px;
  }
  .input-form#code{
    display: inline-block;
    width: 220px;
  }
  .open-button {
    display: inline-block;
    width: 300px;
  }
  .stock-price {
    display: inline-block;
    width: 1000px;
    text-align: center;
  }
</style>
