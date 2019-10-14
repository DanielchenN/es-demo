const { Client } =  require('elasticsearch')
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
// client.indices.create({
//   index: 'myfirst.indexx'
// }, (err, data) => {
//   if(err) {
//     // console.log(err)
//   } else {
//     console.log('create success', data)
//   }
// })

// 既然添加了索引，肯定是要把索引应用
/**
 * Adds a JSON document to the specified index and makes it searchable. 
 * If the document already exists, updates the document and increments its version.
 */
// client.index({
//   index: 'myfirst.indexx',
//   id: '1',
//   type: 'first_list',
//   body: {
//       "Key1": "Content for key one",
//       "Key2": "Content for key two",
//       "key3": "Content for key three",
//   }
// }, (err, resp) => {
//   // console.log('resp', resp)
// });

;(async() => {
  const resp2 = await client.index({
    index: 'myfirst.indexx',
    id: '1',
    type: 'first_list',
    body: {
        "Key1": "Content for key one",
        "Key2": "Content for key two",
        "key3": "Content for key three",
    }
  })

  // 通过索引search
  const res = await client.search({
    index: 'myfirst.indexx',
    type: 'first_list',
    body: {
      size: 200,
      from: 0,
      query:{ 
        match_all:{}
      }
    }
  })
  console.log('res', res.hits.hits)
})()

