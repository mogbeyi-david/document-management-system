import bcrypt from 'bcrypt';

class Hash {
  async hashPassword(password) {
    const saltRounds = 10;
    const SALT_FACTOR = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, SALT_FACTOR);
  }
}

export default (new Hash());