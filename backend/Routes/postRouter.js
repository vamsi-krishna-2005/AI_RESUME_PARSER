const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getPosts, 
  getUserPosts, 
  toggleLike, 
  addComment, 
  deletePost 
} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPosts);

// Protected routes (require authentication)
router.post('/', authMiddleware, createPost);
router.get('/user', authMiddleware, getUserPosts);
router.put('/:postId/like', authMiddleware, toggleLike);
router.post('/:postId/comment', authMiddleware, addComment);
router.delete('/:postId', authMiddleware, deletePost);

module.exports = router; 