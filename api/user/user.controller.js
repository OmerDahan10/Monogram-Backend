const userService = require('./user.service');
const logger = require('../../services/logger.service');

module.exports ={
    getUser,
    updateUser,
    getUserByUsername,
    getUsers
}

async function getUser(req, res) {
    try {
        // console.log(req.params);
        const user = await userService.getById(req.params.userId);
        res.send(user);
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

async function getUserByUsername(req,res){
   try{
    //    console.log(req.params.username);
       const user = await userService.getByUsername(req.params.username)
       res.send(user);
   }catch(err){
    logger.error('Failed to get user', err)
    res.status(500).send({ err: 'Failed to get user' })
   }
}

async function updateUser(req, res) {
    try {
        const user = req.body;
        const savedUser = await userService.updateUser(user);
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

async function getUsers(req,res) {
    try{
        const search = req.query.search;
        console.log('search',search);
        const users = await userService.getUsers(search);
        res.send(users);
    } catch(err){
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}