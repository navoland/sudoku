// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'sokoban-j5n2j'})

const db = cloud.database()
const user = db.collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID: id} = cloud.getWXContext()

  delete event.userInfo

  let data = await user.where({_id: id})
    .get()
    .then(({data}) => data[0])
    .catch(() => null)

  data &&
  data.user &&
  (data.user.level || 0) > event.user.level &&
  (event.user.level = data.user.level)

  let level
  if (data && data.level) level = data.level

  if (!data || (data.timestamp || 0) < event.timestamp) data = event

  delete data._id

  data = format(data)
  level && (data.level = level)

  await user.doc(id).set({data})

  delete data.level

  return {data, id}
}

// 1.3.0 存储数据格式变更
function format(data) {
  if (data.user) return data
  data.user = {
    avatar: data.avatar,
    city: data.city,
    country: data.country,
    gender: data.gender,
    name: data.name,
    level: data.level,
    province: data.province
  }
  const keys = ['timestamp', 'user', 'setting']
  for (const k in data) {
    if (keys.includes(k)) continue
    delete data[k]
  }
  return data
}