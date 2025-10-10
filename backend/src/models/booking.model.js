import mongoose,{Schema} from "mongoose";

const bookingSchema = new Schema({
    listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
});

const Booking = mongoose.model("Booking", bookingSchema);
export {Booking};