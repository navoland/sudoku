// @ts-nocheck
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'colloc-dev'})

const db = cloud.database()
const user = db.collection('user')
const _ = db.command


// 云函数入口函数
exports.main = async () => {
  return user
    .orderBy('last.timestamp', 'desc')
    .limit(8)
    .field({user: true, last: true})
    .get()
    .then(({data}) => data)
    .catch(() => null)
}
