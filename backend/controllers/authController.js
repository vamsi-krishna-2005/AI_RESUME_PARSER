const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate tokens
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ id: userId, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, bio, linkedin, skills, walletAddress } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'User already exists' });
    
    const hashed = await bcrypt.hash(password, 10);
    // Set role to 'admin' if email and password are both admin@gmail.com and admin, else 'user'
    const role = (email === 'admin@gmail.com' && password === 'admin') ? 'admin' : 'user';
    const user = await User.create({ name, email, password: hashed, bio, linkedin, skills, walletAddress, role });
    
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    
    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();
    
    res.json({ 
      accessToken, 
      refreshToken,
      user: { id: user._id, name, email, bio, linkedin, skills, walletAddress, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      if (email === 'admin@gmail.com' && password === 'admin') {
        // Auto-create admin user if not found
        const hashed = await bcrypt.hash(password, 10);
        user = await User.create({ name: 'Admin', email, password: hashed, role: 'admin' });
      } else {
        return res.status(400).json({ msg: 'User not found' });
      }
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    
    // If admin credentials, set role to admin
    if (user.email === 'admin@gmail.com' && password === 'admin') {
      user.role = 'admin';
      await user.save();
    }
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    
    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();
    
    res.json({ 
      accessToken, 
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, bio: user.bio, linkedin: user.linkedin, skills: user.skills, walletAddress: user.walletAddress, role: user.role } 
    });
  } catch (error) {
    console.log('error: ', error)
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ msg: 'Refresh token required' });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user and check if refresh token matches
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ msg: 'Invalid refresh token' });
    }
    
    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user._id, user.role);
    
    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();
    
    res.json({ 
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken 
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Refresh token expired' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      // Clear refresh token from database
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
      );
    }
    
    res.json({ msg: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password -refreshToken');
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 