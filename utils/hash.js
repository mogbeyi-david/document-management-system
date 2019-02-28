import bcrypt from 'bcrypt';

class Hash {
  saltRounds = 10;

  async hashPassword(password) {
    const SALT_FACTOR = bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, SALT_FACTOR);
  }
}

export default (new Hash());