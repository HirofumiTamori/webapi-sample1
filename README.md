# webapi-sample1

> Web Scraping Sample with CORS proxy using Vue-Electron

#### What's This?

My first vue-electron sample using
- HTTP Access with axios
- CORS proxy in main/index.dev.js (Unfortunatelly it does not work behind proxy)
- HTML Parser with fast-html-parser
- UI with Element-UI
- Database with nedb, pure javascript mongo subset DB

##### Function
Get the stock price by web scraping.

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
