import { model, Schema } from "mongoose";
import validator from "validator";
import { genSalt, hash } from "bcrypt";

const userSchema = new Schema({
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

const User = model("user", userSchema);

export default User;
