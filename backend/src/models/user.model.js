import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing"
    }
  ]
});

const User = mongoose.model("User", userSchema);
export {User};