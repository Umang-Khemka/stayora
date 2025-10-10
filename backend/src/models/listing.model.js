import mongoose,{Schema} from "mongoose";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Rooms",
            "Iconic Cities",
            "Castles",
            "Mountain Views",
            "Camping",
            "Amazing Nature",
            "Farms",
            "Arctic",
            "Boats"
        ],
        message: "Selected category is not allowed"
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    bookings: [ 
        {
            type: Schema.Types.ObjectId,
            ref: "Bookings",
        }
    ]
});

const Listing = mongoose.model("Listing", listingSchema);
export {Listing};