const axios = require('axios')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const blacklist = [
    'PancakeSwap V2: EBSC',
    '0x0f59d00312b0c8f9215fdbad81d3341fbf676900',
    '0xed3d9db9c714f88df9eb579134b525f9863b2dda',
    '0x64be33a23a7753a8e6f32117f480cb04cc753378',
    'Burn Address',
    'Lithium: EBSC Token',
    'Hotbit 2'
  ]
  
  
  function numberFormatter(strValue) {
    if (!strValue) return 0
  
    const parsedStrValue = strValue.trim().replace(/,/g, '').replace('$', '')
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
  
  function categorize(wallets, tiers, startIndex) {
    let categorized_wallets = []
    let hasBlacklistedAddress = false
  
    let index = startIndex + 1
    wallets.map(wallet => {
      if(blacklist.indexOf(wallet.address.trim()) == -1) {
        if (wallet.amount >= tiers['evangelist'].min) {
          wallet.index = index
          wallet.tier = tiers['evangelist'].title
          tiers['evangelist'].total += wallet.amount
          tiers['evangelist'].count++
          categorized_wallets.push(wallet)
          index++
        } else  if (wallet.amount >= tiers['strategist'].min) {
          wallet.index = index
          wallet.tier = tiers['strategist'].title
          tiers['strategist'].total += wallet.amount
          tiers['strategist'].count++
          categorized_wallets.push(wallet)
          index++
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
  
  async function fetch (page) {
    return await axios.get('https://bscscan.com/token/generic-tokenholders2?a=0x01a78db633940579e15e7bdb8edfee8ecdea4522&m=normal&p=' + page)
  }
  
  async function fetchPrice () {
    return await axios.get('https://europe-west1-earlybsc-c1957.cloudfunctions.net/api/values')
  }
  
  exports.getData = async () => {
    let payload = {
        itemsPerPage: 50,
        ebscInfo: {
            holdersValue: "",
            holders: "",
            marketcap: "",
            change: "",
            price: "",
            priceNumber: 0,
            liquidity: ""
        },
        tiers : {
            "strategist": {
            min: 2500000,
            title: "strategist",
            count: 0,
            total: 0
            },
            "evangelist": {
            min: 7000000,
            title: "evangelist",
            count: 0,
            total: 0
            }
        },
        wallets : []
    }

    let page_number = 1
    let goToNext = true
  
    const ebscInfo = await fetchPrice()
    ebscInfo['data'].priceNumber = numberFormatter(ebscInfo['data'].price)
    payload.ebscInfo = ebscInfo['data']
  
    while (goToNext) {
      let wallets = await getNextPage(page_number)
      let categorized = categorize(wallets, payload['tiers'], payload.wallets.length)
    
      payload.tiers = categorized.tiers
      payload.wallets = payload.wallets.concat( categorized.wallets)
  
      if (categorized.wallets.length != payload.itemsPerPage && !categorized.hasBlacklistedAddress) {
        goToNext = false
      }
      
      page_number++
    }
    
    return payload
  }