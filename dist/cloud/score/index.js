// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'sokoban-j5n2j'})

const db = cloud.database()
const user = db.collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  const {type, level} = event
  const {OPENID: id} = cloud.getWXContext()
  return type === 'set' ? set(id, level) : get(event)
}

async function set(id, level) {
  let data = await user.where({_id: id})
    .get()
    .then(({data}) => data[0])
    .catch(() => null)

  const timestamp = Date.now()

  if (!data) {
    return user.doc(id).set({
      data: {
        timestamp,
        user: {level}
      }
    })
  } else {
    return user.doc(id).update({
      data: {
        timestamp,
        user: {level}
      }
    })
  }
}

async function get() {

}