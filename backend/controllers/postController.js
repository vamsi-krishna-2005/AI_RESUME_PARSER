const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { content, tags, imageUrl } = req.body;
    const userId = req.user.id;

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const newPost = new Post({
      content,
      author: userId,
      authorName: user.name,
      tags: tags || [],
      imageUrl: imageUrl || null
    });

    const savedPost = await newPost.save();
    
    // Populate author details
    await savedPost.populate('author', 'name email');
    
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all posts (public)
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublic: true })
      .populate('author', 'name email')
      .populate('likes', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's posts
const getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ author: userId })
      .populate('author', 'name email')
      .populate('likes', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Like/Unlike a post
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    await post.populate('likes', 'name');
    
    res.json({ 
      liked: !isLiked, 
      likesCount: post.likes.length,
      post 
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add comment to a post
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      user: userId,
      userName: user.name,
      content
    };

    post.comments.push(newComment);
    await post.save();
    
    await post.populate('comments.user', 'name');
    
    res.json(post);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if user owns the post
    if (post.author.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await Post.findByIdAndDelete(postId);
    res.json({ msg: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createPost,
  getPosts,
  getUserPosts,
  toggleLike,
  addComment,
  deletePost
}; 