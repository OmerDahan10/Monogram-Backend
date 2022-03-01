const postService = require('./post.service');
const logger = require('../../services/logger.service');
const socketService = require('../../services/socket.service')

module.exports ={
    getPosts,
    updatePost,
    removePost,
    addPost,
    getUserPosts
}


async function getPosts(req,res){
    try{
        // console.log(req.query);
        const userId = req.query.userId;
        const posts = await postService.query(userId);
        // console.log(posts);
        res.send(posts);
    }catch(err){
        logger.error('Failed to get posts',err);
        res.status(500).send({err:'Failed to get posts'})
    }
}

async function getUserPosts(req,res){
    try{
        // console.log(req.params);
        const userId = req.params.userId;
        const posts = await postService.getUserPosts(userId);
        res.send(posts);
    }catch(err){
        logger.error('Failed to get user posts',err);
        res.status(500).send({err:'Failed to get user posts'})
    }
}

async function updatePost(req,res){
    try{
        const post = req.body;
        console.log(req.session);
       const userId = req.session.user._id
       const user = req.session.user
       const updatedPost = await postService.update(post);

       socketService.broadcast({type: 'post-updated', data: updatedPost, userId: userId})
    //    socketService.emitTo({type: 'user-updated', data: user, label: user._id})

       res.send(updatedPost); 
    }catch(err){
        logger.error('Failed to update post',err);
        res.status(500).send({err:'Failed to update post'});
    }
}

async function removePost(req,res){
    try{
        const postId = req.params.postId;
        await postService.remove(postId);
        res.send({msg:'post deleted'})
    }catch(err){
        logger.error('Failed to delete post',err);
        res.status(500).send({err:'Failed to delete post'});
    }
}

async function addPost(req,res){
    try{
        console.log(req.session);
        const post = req.body;
        const userId = req.session.user._id;
        const addedPost = await postService.add(post);
        socketService.emitToUsers({type:'post-added',userId: userId});
        res.send(addedPost);
    }catch(err){
        logger.error('Failed to add post',err);
        res.status(500).send({err:'Failed to add post'}); 
    }
}