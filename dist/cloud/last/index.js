// @ts-nocheck
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'colloc-dev'})


const db = cloud.database()
const user = db.collection('user')
const _ = db.command

// 云函数入口函数
exports.main = async e => {
  const {userInfo: {openId: id}} = e
  let data = await query(id).catch(() => null)
  if (data) return update(id, {last: e.last})
  return set(id, {last: e.last})
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
