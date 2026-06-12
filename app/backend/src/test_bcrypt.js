import bcrypt from 'bcrypt';
const hash = '$2b$10$wEgh1sQW4jV0B26M/l5y/OnfV.VzK6B1Vp4hXjDqf.u4yK0h9GvPq';
console.log('Match password123:', await bcrypt.compare('password123', hash));
