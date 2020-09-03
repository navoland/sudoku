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

  if (type === 'list:level') return getLevelList(event)
  else if (type === 'alexa') return getAlexa(id)
}

async function getLevelList({level, cursor}) {
  return await db.collection('user')
    .where({[`level.${level}`]: _.exists(true)})
    .orderBy(`level.${level}.total`, 'asc')
    .orderBy(`level.${level}.timestamp`, 'desc')
    .skip(cursor * 10)
    .limit(10)
    .get()
    .then(({data}) => data)
    .catch(() => null)
}

async function getAlexa(id) {
  return user.aggregate()
    .replaceRoot({newRoot: {
      _id: '$_id',
      level: '$user.level',
      timestamp: '$timestamp'
    }})
    .sort({level: -1, timestamp: -1})
    .group({
      _id: null,
      all: $.push('$_id')
    })
    .project({
      id,
      alexa: $.indexOfArray(['$all', id])
    })
    .end()
    .then(({list}) => list[0])
}