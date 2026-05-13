const authService = require('../../services/auth.service');
const prisma = require('../../db_query/prisma');
const { publicUserSelect } = require('../../db_query/user.query');

/** HttpOnly auth cookie `accessToken` (name is unchanged on IP — browsers still send it on matching requests).
 *  - `Secure` must be false on plain HTTP (IP:3000 without TLS), or the cookie is dropped.
 *  - Override: COOKIE_SECURE=true | false. If unset: secure only when NODE_ENV=production AND FRONTEND_URL starts with https://
 */
const accessTokenCookieOptions = () => {
  const explicit = process.env.COOKIE_SECURE;
  let secure = false;
  if (explicit === 'true') secure = true;
  else if (explicit === 'false') secure = false;
  else {
    const front = String(process.env.FRONTEND_URL || '').trim();
    const frontendHttps = /^https:\/\//i.test(front);
    secure = process.env.NODE_ENV === 'production' && frontendHttps;
  }
  return {
    httpOnly: true,
    secure,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    path: '/',
  };
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const { user, token } = await authService.loginUser(email, password);
    
    res.cookie('accessToken', token, accessTokenCookieOptions());

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
    const opts = accessTokenCookieOptions();
    res.clearCookie('accessToken', {
      path: opts.path,
      httpOnly: opts.httpOnly,
      sameSite: opts.sameSite,
      secure: opts.secure,
    });
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
        
        res.cookie('accessToken', token, accessTokenCookieOptions());

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
