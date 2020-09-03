// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'sokoban-j5n2j'
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
const user = db.collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  const {type} = event
  const {OPENID: id} = cloud.getWXContext()

  if (type === 'get') return get(event)
}

async function get({level}) {
  return await db.collection('user')
    .where({[`level.${level}`]: _.exists(true)})
    .orderBy(`level.${level}.total`, 'asc')
    .orderBy(`level.${level}.timestamp`, 'desc')
    .limit(1)
    .get()
    .then(({data}) => data[0].level[level])
    .catch(() => null)
}