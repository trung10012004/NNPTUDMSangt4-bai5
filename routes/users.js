var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users')
/* GET users listing. */
//localhost:3000/api/v1/users

//GET ALL USER (query username includes)
router.get('/', async function (req, res, next) {

  let queries = req.query

  let usernameQ = queries.username ? queries.username : ''

  let data = await userModel.find({
    isDeleted: false,
    username: new RegExp(usernameQ, 'i')
  }).populate({
    path: 'role',
    select: 'name'
  })

  res.send(data)

})


//GET USER BY ID
router.get('/:id', async function (req, res, next) {

  try {

    let id = req.params.id

    let result = await userModel.find({
      isDeleted: false,
      _id: id
    })

    if (result.length > 0) {
      res.send(result[0])
    } else {
      res.status(404).send("ID NOT FOUND")
    }

  } catch (error) {
    res.status(404).send(error.message)
  }

})


//CREATE USER
router.post('/', async function (req, res, next) {

  let newUser = new userModel({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    role: req.body.role
  })

  await newUser.save()

  res.send(newUser)

})


//UPDATE USER
router.put('/:id', async function (req, res, next) {

  try {

    let id = req.params.id

    let result = await userModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )

    res.send(result)

  } catch (error) {
    res.status(404).send(error.message)
  }

})


//SOFT DELETE USER
router.delete('/:id', async function (req, res, next) {

  try {

    let id = req.params.id

    let result = await userModel.findById(id)

    result.isDeleted = true

    await result.save()

    res.send(result)

  } catch (error) {
    res.status(404).send(error.message)
  }

})


//ENABLE USER
router.post('/enable', async function (req, res, next) {

  let email = req.body.email
  let username = req.body.username

  let user = await userModel.findOne({
    email: email,
    username: username
  })

  if (!user) {
    return res.status(404).send("USER NOT FOUND")
  }

  user.status = true

  await user.save()

  res.send(user)

})


//DISABLE USER
router.post('/disable', async function (req, res, next) {

  let email = req.body.email
  let username = req.body.username

  let user = await userModel.findOne({
    email: email,
    username: username
  })

  if (!user) {
    return res.status(404).send("USER NOT FOUND")
  }

  user.status = false

  await user.save()

  res.send(user)

})


module.exports = router
