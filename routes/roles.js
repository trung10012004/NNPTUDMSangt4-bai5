var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles')
let userModel = require('../schemas/users')


//GET ALL ROLE
router.get('/', async function(req,res,next){
    let data = await roleModel.find({
        isDeleted:false
    })
    res.send(data)
})


//GET ROLE BY ID
router.get('/:id', async function(req,res,next){
    try{
        let id = req.params.id
        let result = await roleModel.find({
            _id:id,
            isDeleted:false
        })

        if(result.length>0){
            res.send(result[0])
        }else{
            res.status(404).send("ID NOT FOUND")
        }

    }catch(error){
        res.status(404).send(error.message)
    }
})


//CREATE ROLE
router.post('/', async function(req,res,next){

    let newRole = new roleModel({
        name:req.body.name,
        description:req.body.description
    })

    await newRole.save()

    res.send(newRole)
})


//UPDATE ROLE
router.put('/:id', async function(req,res,next){

    try{

        let id = req.params.id

        let result = await roleModel.findByIdAndUpdate(
            id,
            req.body,
            {new:true}
        )

        res.send(result)

    }catch(error){
        res.status(404).send(error.message)
    }

})


//SOFT DELETE ROLE
router.delete('/:id', async function(req,res,next){

    try{

        let id = req.params.id

        let result = await roleModel.findById(id)

        result.isDeleted = true

        await result.save()

        res.send(result)

    }catch(error){
        res.status(404).send(error.message)
    }

})


//GET USERS BY ROLE ID
router.get('/:id/users', async function(req,res,next){

    try{

        let roleId = req.params.id

        let users = await userModel.find({
            role:roleId,
            isDeleted:false
        }).populate({
            path:'role',
            select:'name'
        })

        res.send(users)

    }catch(error){
        res.status(404).send(error.message)
    }

})


module.exports = router
