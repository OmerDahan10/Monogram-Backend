const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const userService = require('../user/user.service'); 
const socketService = require('../../services/socket.service');
const ObjectId = require('mongodb').ObjectId;

module.exports ={
    query,
    update,
    add,
    remove,
    getUserPosts
}

async function query(userId){
    try{
        const collection = await dbService.getCollection('post');
        // console.log(userId);
        const user = await userService.getById(userId);
        // console.log(user);
        let posts = await Promise.all(user.followings.map(async (following) =>{
        let post = await collection.find({"by._id" : following._id}).toArray();
        return post;
    }))
        // console.log(posts);
        // console.log(await collection.find({"by._id" : ObjectId(userId)}).toArray());
        posts = posts.flat();
        let sortedPosts = sortPostsByTime(posts);
        // var posts = await collection.find({}).toArray();
        return sortedPosts;
    }catch(err){
        logger.error('cannot find posts',err)
        throw err;
    }
}

async function getUserPosts(userId){
    try{
        const collection = await dbService.getCollection('post');
        // console.log(userId);
        // add user id to find
        var posts = await collection.find({'by._id' : ObjectId(userId)}).toArray();
        // console.log(posts);
        return posts;
    }catch(err){
        logger.error('cannot find posts',err)
        throw err; 
    }
}

async function update(post){
    try{
        const collection = await dbService.getCollection('post');
        const postToSave ={
            _id:ObjectId(post._id),
            comments:post.comments,
            likedBy:post.likedBy
        }
        await collection.updateOne({_id:postToSave._id},{$set:postToSave});
        return post;
    }catch(err){
        logger.error(`cannot update post ${post._id}`);
        throw err;
    }
}

async function add(post){
    try{
        post.by._id = ObjectId(post.by._id);
        const collection = await dbService.getCollection('post');
        await collection.insertOne(post);
        return post;
    }catch(err){
        logger.error('cannot add post',err);
        throw err;
    }
}

async function remove(postId){
    try{
        const collection = await dbService.getCollection('post');
        await collection.deleteOne({'_id':ObjectId(postId)});
    }catch(err){
        logger.error('cannot delete post',err);
        throw err;
    }
}



function sortPostsByTime(posts) {
    posts.sort((post1, post2) => {
        let time1 = post1.createdAt;
        let time2 = post2.createdAt;
        if (time1 < time2) return -1;
        else if (time1 > time2) return 1;
        else return 0;
    })
    return posts;
}
