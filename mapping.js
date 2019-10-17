const { Client } = require('elasticsearch')
const cities = require('./cities.json')
const client = new Client({ host: 'http://localhost:9200' })

const mappingCreate = async function() {
  return await client.indices.create({
    index: "mapping_name",
    include_type_name: false,
    body: {
      mappings: {
          properties: {
            country: { type: "keyword" },
            name: { type: "text" },
            lat: { type: "double" },
            lng: {type: "double"}
          }
        },                                                   
    }
  })
}

// https://www.elastic.co/guide/en/elasticsearch/reference/7.x/date.html
// 加入一个日期类型
const putMapping = async function () {
  return await client.indices.putMapping({
    index: 'mapping_name',
    include_type_name: false,
    body: {
      properties: {
        time: {
          type: "date",
          format: "yyyy-MM-dd HH:mm:ss||epoch_millis"
        }
      }
    }
  })
}

const genBulk = async function () {
  var bulk = []
  let count = 0
  cities.forEach(city => {
    if (count > 2000) return
    count += 1
    bulk.push(
      {
        index: { 
        _index: "mapping_name", 
      }
  })
    bulk.push(city)
  })
  
  // 对传递的数据执行批量索引 -- 不想写try catch了hhhh
  let res = await client.bulk({body: bulk})
  console.log('res', res)
}


/**
 * 这里要注意，如果bulk里面写了_type, 但是include_type_name:false, 查不出来数据
 * type在之后会被移除
 * 
 */
const search = async function () {
  const body = {
    query: {
      regexp: {
        name: 'sa.'
      }
    },
    size:5
  }
  return await client.search({index:'mapping_name',  body:body})
}

;(async () => {
  // let res = await mappingCreate()
  // 然后插入一个date字段
  // let newMapping = await putMapping()
  // await genBulk()
  // console.log('newMapping', newMapping); // { acknowledged: true }
  let res = await search()
  console.log('res', res.hits.hits)
})()