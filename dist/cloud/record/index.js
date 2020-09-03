// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'sokoban-j5n2j'
})

const db = cloud.database()
const _ = db.command
const user = db.collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  const {type} = event
  const {OPENID: id} = cloud.getWXContext()
  return type === 'set' ? set(id, event) : get(event)
}

async function set(id, {level, steps}) {
  level = `${level}`

  let info = await user
    .doc(id)
    .get()
    .catch(() => null)

  if (!info || !info.data) return

  const timestamp = Date.now()

  if (info.data.level) {
    const old = info.data.level[level]
    if ((old && old.total > steps.length) || !old) {
      return user.doc(id).update({
        data: {
          [`level.${level}`]: _.set({
            steps,
            timestamp,
            total: steps.length
          })
        }
      })
    }
  } else {
    return user.doc(id).update({
      data: {
        level: _.set({
          [level]: {
            steps,
            timestamp,
            total: steps.length
          }
        })
      }
    })
  }
}

async function get() {
  return 'get'
}