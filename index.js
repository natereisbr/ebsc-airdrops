
const express = require('express')
const axios = require('axios')
const jsdom = require("jsdom");
const bodyParser = require('body-parser')
const { JSDOM } = jsdom;
const app = express()
const port = process.env.PORT || 5000
const path = require('path');
const fs = require('fs');

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extend:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

const blacklist = [
  ' PancakeSwap V2: EBSC',
  '0x0f59d00312b0c8f9215fdbad81d3341fbf676900',
  '0xed3d9db9c714f88df9eb579134b525f9863b2dda',
  'Burn Address',
  'Lithium: EBSC Token',
  'Hotbit 2'
]


function numberFormatter(strValue) {
  const parsedStrValue = strValue.replace(/,/g, '')
  return parseFloat(parsedStrValue)
}

function parser(data) {
  const dom = new JSDOM(data)
  const rows = dom.window.document.querySelector("tbody").children
  let wallets = []

  for (let i = 0; i < rows.length; i++) {
    let row = rows[i].children
      wallets.push({
        'address': row[1].textContent,
        'amount': numberFormatter(row[2].textContent)
      })
  }

  return wallets
}

function categorize(wallets, tiers) {
  let categorized_wallets = []
  let hasBlacklistedAddress = false

  wallets.map(wallet => {
    if(blacklist.indexOf(wallet.address) == -1) {
      if (wallet.amount >= tiers['evangelist'].min) {
        wallet.tier = tiers['evangelist'].title
        tiers['evangelist'].total += wallet.amount
        categorized_wallets.push(wallet)
  
      } else  if (wallet.amount >= tiers['strategist'].min) {
        wallet.tier = tiers['strategist'].title
        tiers['strategist'].total += wallet.amount
        categorized_wallets.push(wallet)
      }
    } else {
      hasBlacklistedAddress = true
    }
  })

  return { wallets: categorized_wallets, tiers, hasBlacklistedAddress }
}

async function getNextPage (page_number) {
  let page = await fetch(page_number)
  let wallets = parser(page.data)

  return wallets
}

async function getData(payload) {
  let page_number = 1
  let goToNext = true

  while (goToNext) {
    let wallets = await getNextPage(page_number)
    let categorized = categorize(wallets, payload['tiers'])
  
    payload.tiers = categorized.tiers
    payload.wallets = payload.wallets.concat( categorized.wallets)

    if (categorized.wallets.length != payload.itemsPerPage && !categorized.hasBlacklistedAddress) {
      goToNext = false
    }
    
    page_number++
  }
  
  return payload
}

async function fetch (page) {
  return await axios.get('https://bscscan.com/token/generic-tokenholders2?a=0x01a78db633940579e15e7bdb8edfee8ecdea4522&m=normal&p=' + page)
}

app.get('/', async (req, res) => {
  let payload = {
    itemsPerPage: 50,
    tiers : {
      "strategist": {
        min: 2500000,
        title: "strategist",
        total: 0
      },
      "evangelist": {
        min: 7000000,
        title: "evangelist",
        total: 0
      }
    },
    wallets : []
  }

  payload = await getData(payload)

  console.log(payload.wallets.length)

  res.render('index.ejs',{payload:  JSON.stringify(payload)});
})

app.listen(port, () => {
  console.log('Server started...')
})
