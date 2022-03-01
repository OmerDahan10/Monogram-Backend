const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;


module.exports = {
    getByUsername,
    add,
    getById,
    updateUser,
    getUsers
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user');
        const user = await collection.findOne({ username });
        return user;
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function getById(userId) {
    try {
        // console.log(userId);
        const collection = await dbService.getCollection('user');
        const user = await collection.findOne({ "_id": ObjectId(userId) });
        delete user.password
        return user
    } catch (err) {
        logger.error(`cannot find user ${userId}`, err)
        throw err;
    }
}

async function updateUser(user) {
    try {
        //check ObjectId()
        const collection = await dbService.getCollection('user');
        await collection.updateOne({ _id: user._id }, { $set: user })
        return user;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: '',
            createdAt: Date.now(),
            following: [],
            followers: [],
            savedPostsIds: []
        }

        const collection = await dbService.getCollection('user');
        await collection.insertOne(userToAdd);
        return userToAdd
    } catch (err) {
        logger.error(`cannot add user`, err)
        throw err
    }
}

async function getUsers(search){
    try{
        let regSearch = '^' + search;
        regSearch = new RegExp(regSearch)
        console.log('reqExp search',regSearch);
        const collection = await dbService.getCollection('user');
        const users = await collection.find({username:{$in:[regSearch]}}).toArray();
        // const users = await collection.find({username:{$in:[]}})
        console.log('users from mongo',users);
        return users;
        // const users = await collection.find({username:{search}})
    }catch(err){
        logger.error(`cannot find users`, err)
        throw err
    }
}