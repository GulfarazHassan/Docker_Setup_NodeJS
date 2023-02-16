const express = require('express');

const postCnntroller = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, postCnntroller.getAllPosts).post(protect, postCnntroller.createPost);

router.route('/:id').get(postCnntroller.getOnePost).patch(postCnntroller.updatePost).delete(postCnntroller.deletePost);

module.exports = router;