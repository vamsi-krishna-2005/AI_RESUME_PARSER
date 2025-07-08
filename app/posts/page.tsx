'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import authService from '../../components/authService';

interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  authorName: string;
  likes: string[];
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
    };
    userName: string;
    content: string;
    createdAt: string;
  }>;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

  // Dummy posts for initial display
  const dummyPosts: Post[] = [
    {
      _id: '1',
      content: 'Just completed an amazing project using React and Node.js! The learning journey has been incredible. #webdevelopment #react #nodejs',
      author: { _id: '1', name: 'Sarah Johnson', email: 'sarah@example.com' },
      authorName: 'Sarah Johnson',
      likes: ['2', '3'],
      comments: [
        {
          _id: '1',
          user: { _id: '2', name: 'Mike Chen' },
          userName: 'Mike Chen',
          content: 'Great work! Would love to see the code.',
          createdAt: '2024-01-15T10:30:00Z'
        }
      ],
      tags: ['webdevelopment', 'react', 'nodejs'],
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z'
    },
    {
      _id: '2',
      content: 'Excited to share that I\'ve been promoted to Senior Developer! Hard work really does pay off. Thank you to everyone who supported me along the way. #careergrowth #promotion',
      author: { _id: '2', name: 'Mike Chen', email: 'mike@example.com' },
      authorName: 'Mike Chen',
      likes: ['1', '3', '4'],
      comments: [
        {
          _id: '2',
          user: { _id: '1', name: 'Sarah Johnson' },
          userName: 'Sarah Johnson',
          content: 'Congratulations! Well deserved! 🎉',
          createdAt: '2024-01-14T15:20:00Z'
        }
      ],
      tags: ['careergrowth', 'promotion'],
      createdAt: '2024-01-14T14:00:00Z',
      updatedAt: '2024-01-14T14:00:00Z'
    },
    {
      _id: '3',
      content: 'Looking for a talented UX Designer to join our team. We\'re building something amazing and need creative minds! DM me if interested. #hiring #uxdesign #startup',
      author: { _id: '3', name: 'Emma Rodriguez', email: 'emma@example.com' },
      authorName: 'Emma Rodriguez',
      likes: ['1', '2'],
      comments: [],
      tags: ['hiring', 'uxdesign', 'startup'],
      createdAt: '2024-01-13T11:00:00Z',
      updatedAt: '2024-01-13T11:00:00Z'
    }
  ];

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load posts from localStorage or use dummy posts
    const savedPosts = localStorage.getItem('careermatch_posts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      } catch (error) {
        console.error('Error parsing saved posts:', error);
        setPosts(dummyPosts);
        localStorage.setItem('careermatch_posts', JSON.stringify(dummyPosts));
      }
    } else {
      setPosts(dummyPosts);
      localStorage.setItem('careermatch_posts', JSON.stringify(dummyPosts));
    }
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    setIsLoading(true);
    try {
      // Create new post object
      const newPostObj: Post = {
        _id: Date.now().toString(),
        content: newPost,
        author: { _id: user._id || user.id, name: user.name, email: user.email },
        authorName: user.name,
        likes: [],
        comments: [],
        tags: extractTags(newPost),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to beginning of posts array
      const updatedPosts = [newPostObj, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('careermatch_posts', JSON.stringify(updatedPosts));

      // Clear form
      setNewPost('');
      setShowAddPost(false);

      // Try to save to backend if authenticated
      if (authService.isAuthenticated()) {
        try {
          await authService.fetchWithAuth('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: newPost,
              tags: extractTags(newPost)
            }),
          });
        } catch (error) {
          console.error('Failed to save post to backend:', error);
        }
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTags = (content: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = content.match(tagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : [];
  };

  const handleLike = (postId: string) => {
    if (!user) return;

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          const isLiked = post.likes.includes(user._id || user.id);
          return {
            ...post,
            likes: isLiked 
              ? post.likes.filter(id => id !== (user._id || user.id))
              : [...post.likes, user._id || user.id]
          };
        }
        return post;
      })
    );

    // Update localStorage
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        const isLiked = post.likes.includes(user._id || user.id);
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== (user._id || user.id))
            : [...post.likes, user._id || user.id]
        };
      }
      return post;
    });
    localStorage.setItem('careermatch_posts', JSON.stringify(updatedPosts));
  };

  const handleComment = (postId: string) => {
    if (!user || !commentText[postId]?.trim()) return;

    const newComment = {
      _id: Date.now().toString(),
      user: { _id: user._id || user.id, name: user.name },
      userName: user.name,
      content: commentText[postId],
      createdAt: new Date().toISOString()
    };

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );

    // Update localStorage
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });
    localStorage.setItem('careermatch_posts', JSON.stringify(updatedPosts));

    // Clear comment text
    setCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Posts</h1>
          <p className="text-xl text-gray-600">Share your thoughts, achievements, and connect with the community</p>
        </div>

        {/* Add Post Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {!showAddPost ? (
            <button
              onClick={() => setShowAddPost(true)}
              className="w-full text-left p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-add-line text-blue-600 text-xl"></i>
                </div>
                <span className="text-gray-600 font-medium">Share something with the community...</span>
              </div>
            </button>
          ) : (
            <div className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind? Use #hashtags to categorize your post..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {newPost.length}/1000 characters
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowAddPost(false);
                      setNewPost('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim() || isLoading}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow-sm p-6">
              {/* Post Header */}
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {post.authorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
                  <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center space-x-2 transition-colors duration-200 ${
                    user && post.likes.includes(user._id || user.id)
                      ? 'text-red-500'
                      : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <i className={`ri-heart-${user && post.likes.includes(user._id || user.id) ? 'fill' : 'line'}`}></i>
                  <span>{post.likes.length}</span>
                </button>

                <button
                  onClick={() => setShowComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
                  className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                >
                  <i className="ri-chat-1-line"></i>
                  <span>{post.comments.length}</span>
                </button>
              </div>

              {/* Comments Section */}
              {showComments[post._id] && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* Add Comment */}
                  <div className="mb-4">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                      />
                      <button
                        onClick={() => handleComment(post._id)}
                        disabled={!commentText[post._id]?.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200"
                      >
                        Comment
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-semibold text-sm">
                            {comment.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-gray-900 text-sm">{comment.userName}</span>
                              <span className="text-gray-500 text-xs">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-file-text-line text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500">Be the first to share something with the community!</p>
          </div>
        )}
      </div>
    </div>
  );
} 