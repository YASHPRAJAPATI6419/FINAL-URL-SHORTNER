import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  gravatar: {
    type: String,
    default: function() {
      const hash = crypto.createHash("md5").update(this.email?.toLowerCase().trim() || "default").digest("hex");
      return `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`;
    }
  },
});

userSchema.pre("save", function(next) {
  if (this.isModified("email")) {
    const hash = crypto.createHash("md5").update(this.email.toLowerCase().trim()).digest("hex");
    this.gravatar = `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`;
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
