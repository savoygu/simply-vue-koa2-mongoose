const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa-cors')
const bodyparser = require('koa-bodyparser')
const app = new Koa()
const router = new Router()

app.use(cors())
app.use(bodyparser())

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/simplyVKM', {
    userMongoClient: true
})

const User = mongoose.model('User', {name: String})

router.get('/users', async (ctx) => {
    const users = await User.find()
    ctx.body = users
})

router.post('/user', async (ctx) => {
    const user = ctx.request.body.user
    let newUser
    if (user._id) {
        let oldUser = await User.findById(user._id)
        oldUser.name = user.name
        newUser = await oldUser.save()
    } else {
        newUser = await User.create({name: user.name})
    }
    ctx.body = newUser
})

router.delete('/user/:id', async (ctx) => {
    const id = ctx.params.id
    const removedUser = await User.remove({_id: id})
    ctx.body = removedUser
})

app
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(3000, () => {
    console.log('Running on：' + 3000)
})
