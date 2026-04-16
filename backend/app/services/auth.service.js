const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../db_query/prisma');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = signToken(user.id);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

const setupFirstAdmin = async () => {
    // Check if any admin exists
    const adminExists = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });
    
    if (adminExists) return { success: true, message: 'Admin already exists' };

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            name: 'Super Admin',
            email: 'admin@labourpulse.com',
            password: hashedPassword,
            role: 'ADMIN',
            bio: 'Lead Administrator of the news portal'
        }
    });

    const { password: _, ...adminSanitized } = admin;
    return { success: true, user: adminSanitized };
};

const registerUser = async (userData) => {
    const { name, email, password, role, bio } = userData;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('User with this email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'AUTHOR',
            bio: bio || ''
        }
    });

    const token = signToken(user.id);
    const { password: _, ...userSanitized } = user;

    return { user: userSanitized, token };
};

module.exports = { loginUser, setupFirstAdmin, registerUser };
