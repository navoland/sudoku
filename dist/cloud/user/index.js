// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'colloc-dev'})


const db = cloud.database()
const user = db.collection('user')
const _ = db.command

// 云函数入口函数
exports.main = async e => {
  const {userInfo: {openId: id}} = e
  let {_id, last, ...data} = await query(id).catch(() => null)

  if (data) {
    data = merge(data.user, e.user)
    return update(id, {user: data})
  } else return set(id, {user: e.user})
}

function query(id) {
  return user.where({_id: id}).get()
    .then(({data}) => data[0])
}

function set(id, data) {
  return user.doc(id).set({data})
}

function update(id, data) {
  delete data._id
  return user.doc(id).update({data})
}

function merge(a, b) {
  if (a == null) return b
  for (const k in b) {
    const oa = isObject(a[k])
    const ob = isObject(b[k])

    if (oa && ob) {
      merge(a[k], b[k])
      continue
    }

    b[k] != null && (a[k] = b[k])
  }
  return a
}

function isObject(o) {
  return Object.prototype.toString.call(o).includes('Object')
}
