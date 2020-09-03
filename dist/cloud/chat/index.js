// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'sokoban-j5n2j'})

const db = cloud.database()
const _ = db.command
const chat = db.collection('chat')

// 云函数入口函数
exports.main = async (event, context) => {
  const {type} = event
  const {OPENID: id} = cloud.getWXContext()

  return type === 'set' ? set(id, event) : get(event)
}

function set(id, {avatar, name, content}) {
  return chat.add({
    data: {
      id,
      name,
      avatar,
      content,
      timestamp: Date.now()
    }
  })
}

function get({skip = 0, limit = 10}) {
  return chat
    .skip(skip)
    .limit(limit)
    .get()
}