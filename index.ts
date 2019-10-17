import { Client } from 'elasticsearch'
const client = new Client({ host: 'http://localhost:9200' })

client.ping({
  requestTimeout: 30000,
}, (err) => {
  if(err) {
    console.log(err)
  } else {
    console.log('gogogo')
  }
})

// 新建一个索引
client.indices.create({
  index: 'myfirst.indexx'
}, (err, data) => {
  if(err) {
    // console.log(err)
  } else {
    console.log('create success', data)
  }
})

// 既然添加了索引，肯定是要把索引应用
/**
 * Adds a JSON document to the specified index and makes it searchable. 
 * If the document already exists, updates the document and increments its version.
 */
client.index({
  index: 'scotch.io-tutorial',
  id: '1',
  type: 'first_list',
  body: {
      "Key1": "Content for key one",
      "Key2": "Content for key two",
      "key3": "Content for key three",
  }
}, (err, resp) => {
  // console.log('resp', resp)
});

// 这个void可以不写，用于推断 --- 空查询{}, 等价于 match_all
const bulkMatchAll = async function (params:void) {
  const body = {
    query: {
      match_all: {
      }
    },
    size: 100
  }
  return await client.search({index:'cities.index',  body:body, type:'cities_list'})
}

const buikMatch = async function (params:void) {
  const body = {
    query: {
      match: {
        country: 'AE'  // 通过名字 key 进行 match
      }
    },
    size: 100
  }
  return await client.search({index:'cities.index',  body:body, type:'cities_list'})
}

/**
 * must 和 should 的区别: 
 * see at @https://stackoverflow.com/questions/28768277/elasticsearch-difference-between-must-and-should-bool-query 
 * must相当于 &&, should 相当于 || 
 * should / must 可以接受一个数组查询多个  和用 空格 分割的是等价的
 */

const matchBool = async function (params: void) {
  const body = {
    query: {
      bool: {
        must: {match: {name: 'Agara'}},
        // 下面两个should等价 must写法同理
        // should: {match: {name: "Agara Adigeni"}}
        // should: [
        //   {match: {name: 'Adigeni'}},
        //   {match: {name: 'Agara'}},
        // ],
      }
    },
    size: 100
  }
  return await client.search({index:'cities.index',  body:body, type:'cities_list'})
}

// operator
// 注意这里， name 里面包含 "Agara 或者 Adigeni"， should 这里作为权重出现。
// 可以更改 should 的 name 与must相同 来观察权重（_score字段）
// 类似的 我们可以加入 boost属性，手动调节权重 
// bool使用的是more match is better
const bulkOperater = async function () {
  const body = {
    query: {
      bool: {
        must: {
          match: {
            name: {
              query: "Agara Adigeni",
              // 默认是or ,加上是 and, 表示同时满足
              operator: "or"
            }
          }
        },
        should: [
          {match: {name: 'Ordino'}},
          {match: {name: 'Agara'}},
        ],
      }
    },
    size: 100
  }
  return await client.search({index:'cities.index',  body:body, type:'cities_list'})
}


const regxpSearch = async function (params:void) {
  const body = {
    query: {
      regexp: {
        name: "agost."
      }
    }
  }
  return await client.search({index:'cities.index',  body:body, type:'cities_list'})
}


async function run () {
  const resp2 = await client.index({
    index: 'scotch.io-tutorial',
    id: '1',
    type: 'first_list',
    body: {
        "Key1": "Content for key one",
        "Key2": "Content for key two",
        "key3": "Content for key three",
    }
  })
  const matchAll = await bulkMatchAll()
  const matchName = await buikMatch()
  const bulkBoll = await matchBool()
  const operater = await bulkOperater()
  const reg = await regxpSearch()
  console.log('matchName', reg.hits.hits)
}

run()
