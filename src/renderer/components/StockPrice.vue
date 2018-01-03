<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <div class="block">
      <div class="input-form" id="company">
        <el-form :model="stockForm" ref="stockForm" label-width="120px" class="stock-form">
          <el-form-item label="会社名" prop="stockName">
            <el-input type="string" v-model="stockForm.name" auto-complete="off" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="input-form" id="code">
        <h3>株価コード:{{stockForm.code}} </h3>
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
  const baseURL = 'https://stocks.finance.yahoo.co.jp/stocks/detail/?code='
  const Database = require('nedb')
  const companyListDB = new Database()
  const dbData = require('../db/stocklist.json')
  let proxyURL = ''
  if (process.env.http_proxy || process.env.https_proxy) {
    proxyURL = 'http://35.194.235.154:8080'
  } else {
    proxyURL = 'http://localhost:8080'
  }

  companyListDB.insert(dbData, (err, newDoc) => {
    if (!err) {
      console.log('Database successfully loaded')
    }
  }) // Set up database content

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
        const h = this.$createElement // エラーダイアログの準備
        const alnum = new RegExp('[A-Za-z0-9]', 'g') // 英数字
        // 半角英数字で入力された場合は全角に変換する
        this.stockForm.name = this.stockForm.name.replace(alnum, (s) => {
          return String.fromCharCode(s.charCodeAt(0) + 65248)
        })
        console.log(this.stockForm.name)
        companyListDB.find(
          {銘柄名: new RegExp('^' + this.stockForm.name + '.*', 'i')})
          .sort({銘柄名: 1}).exec((err, docs) => {
            if (!err) {
              if (docs.length >= 1) {
                for (let x of docs) {
                  console.log(x.銘柄名)
                }
                this.stockResultsDoc = docs
                this.stockForm.code = docs[0].銘柄コード
                this.stockForm.name = docs[0].銘柄名
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
    created () { // 起動時実行
      this.$nextTick(() => { // nextTickの中から呼ぶと子要素のrenderを待てる
        this.dbQuery()
      })
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
        stockResultsDoc: '',
        fullscreenLoading: false,
        dbLoaded: false
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
    text-align: center;
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
