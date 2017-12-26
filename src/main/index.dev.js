/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

import cors_proxy from 'cors-anywhere'

// Listen on a specific host via the HOST environment variable
const host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 8080;

console.log(process.env.http_proxy)
console.log(process.env.https_proxy)

cors_proxy.createServer({
  //originWhitelist: [], // Allow all origins
  //requireHeader: ['origin', 'x-requested-with'],
  //removeHeaders: ['cookie', 'cookie2'],
  redirectSameOrigin: true,
  //getProxyForUrl: url => { return('http://omaha.sm.sony.co.jp:3128')}
}).listen(port, host, function() {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});
// Set environment for development
process.env.NODE_ENV = 'development'

// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true })

// Install `vue-devtools`
require('electron').app.on('ready', () => {
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {})
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})

// Require `main` process to boot app
require('./index')
