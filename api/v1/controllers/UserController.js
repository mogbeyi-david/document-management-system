import {User as UserModel} from '../../../models';


class UserController {
  async isUserUnique(user) {
    const email = user.email;
    const existingUser = await UserModel.find({email: email});
    return existingUser.length <= 0;
  }
}

const User = new UserController();
export default User;