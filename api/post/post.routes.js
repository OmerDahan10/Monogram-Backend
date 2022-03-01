const express = require('express');
const {getPosts,updatePost,removePost,addPost,getUserPosts} = require('./post.controller');
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const router = express.Router();


router.get('/',getPosts);
router.get('/:userId',getUserPosts);
router.delete('/:id',removePost);
router.post('/',addPost);
router.put('/:id',requireAuth,updatePost)

module.exports = router;