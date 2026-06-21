import bcrypt from 'bcryptjs';
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash('password123', salt);
console.log('New hash for password123:', hash);
console.log('Verify:', await bcrypt.compare('password123', hash));
