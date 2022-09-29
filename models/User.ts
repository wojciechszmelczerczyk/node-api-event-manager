import { Model, model, Schema } from "mongoose";
import validator from "validator";
import { genSalt, hash, compare } from "bcrypt";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  login(email: string, password: string): IUser;
}

const userSchema = new Schema<IUser, UserModel>({
  firstName: {
    type: String,
    required: [true, "Please enter a first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter a last name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password is too short. Minimum length is 6 characters"],
  },
});

// hash password before add to db
userSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

userSchema.static("login", async function (email, password) {
  // find user with passed email
  const user = await this.findOne({
    email,
  });
  // if exists compare passed password with one from the database
  if (user) {
    const auth = await compare(password, user.password);
    // if passwords match return user, otherwise throw an error
    if (auth) {
      return user;
    }
    throw Error("Password is too short");
  }
  throw Error("Please enter a valid email");
});

const User = model<IUser, UserModel>("user", userSchema);

export default User;
