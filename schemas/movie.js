var mongoose = require('mongoose')

var movieSchema = new mongoose.Schema({
  title: String,
  doctor: String,
  language: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
  // meta 更新或录入数据的时间记录
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// movieSchema.pre 表示每次存储数据之前都先调用这个方法
// Middleware是一些函数，在执行init,validate,save和remove的时候传递控制权。有两种类型的中间件，pre和post。
// pre is a middleware use as the node middleware. in this case we execute a fun before per fun.
movieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  // pre是在执行save操作之前执行的函数，可以定义多个，并用next实现业务连接，如果不用next只会调用第一个。
  next()
})

// movieSchema 模式的静态方法，静态方法不会直接与数据库进行交互
// 只有经过模型实例化之后才会有这一个方法
movieSchema.statics = {
  // fetch()用来取出目前数据库里面的所有数据
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

// 导出movieSchema模式
module.exports = movieSchema
