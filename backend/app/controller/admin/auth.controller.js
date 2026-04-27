const authService = require('../../services/auth.service');
const prisma = require('../../db_query/prisma');
const { publicUserSelect } = require('../../db_query/user.query');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const { user, token } = await authService.loginUser(email, password);
    
    // Setting Cookie for JWT
    res.cookie('accessToken', token, {
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax', // Protect against CSRF while allowing some cross-site context
      path: '/'
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
        return res.status(401).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const setupAdmin = async (req, res, next) => {
    try {
        const result = await authService.setupFirstAdmin();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const getMe = async (req, res, next) => {
  try {
    const data = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: publicUserSelect,
    });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
    try {
        const { name, email, password, role, bio } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const { user, token } = await authService.registerUser({ name, email, password, role, bio });
        
        // Setting Cookie for JWT
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'lax',
            path: '/'
        });

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        if (error.message.includes('exists')) {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

module.exports = { login, logout, setupAdmin, getMe, register };
