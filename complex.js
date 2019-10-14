const request = require('request')
const fs = require('fs')
const { Client } =  require('elasticsearch')
const cities = require('./cities.json')

const client = new Client({ host: 'http://localhost:9200' })

// 用来请求数据的 --- 一次就行啦 所以注释了
// const getBulkInfo = function() {
//   request('https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json').pipe(fs.createWriteStream('./cities.json'))
// } 

// const genBulk = async function () {
//   var bulk = []
//   cities.forEach(city => {
//     bulk.push(
//       {
//         index: { 
//         _index: "cities.index", 
//         _type: "cities_list",
//       }
//   })
//     bulk.push(city)
//   })
  
//   // 对传递的数据执行批量索引 -- 不想写try catch了hhhh
//   let res = await client.bulk({body: bulk})
//   console.log('res', res)
// }

const bulkSearch = async function() {
  const body = {
    // size: 100,
    // from: 0,
    query: {
      match_all: {
        // name: "St."
      }
    },
    size: 100
  }
  try {
    let res = await client.search({index:'cities.index',  body:body, type:'cities_list'})
    console.log('res', res.hits.hits);
  } catch(e) {
    console.log('e', e);
    
  }

  
}




;(async()=>{
  // await genBulk()
  await bulkSearch()
})()