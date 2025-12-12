import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
      unique: true, // ⭐ Prevent multiple mess creation
    },
    email:{
      type:String,
      required:true,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
    },

    description: {
      type: String,
      required: true,
    },

    chargesPerMonth: {
      type: Number,
      required: true,
    },

    mobileNumber: {
      type: Number,
      required: true,
    },

    imageUrl: {
      type: String,
    },

    foodType: {
      type: String,
      enum: ["veg", "nonveg", "both"],
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    // ❌ REMOVE lat & lng (not needed separately)
    // lat: Number,
    // lng: Number,

    // ⭐ REQUIRED FOR SUPER-FAST NEARBY SEARCH
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
  },
  { timestamps: true }
);

// ⭐ Important Index for $near queries
ownerSchema.index({ location: "2dsphere" });

const Owner =
  mongoose.models.Owner || mongoose.model("Owner", ownerSchema);

export default Owner;
