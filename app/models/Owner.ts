import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
  {
    // 🔑 Core Identity
    ownerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // 💰 Pricing
    chargesPerMonth: {
      type: Number,
      required: true,
      min: 0,
    },

    priceRange: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
    },

    offers: {
      type: String,
      default: "",
    },

    // 📞 Contact
    mobileNumber: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
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

    // 📍 Location (DO NOT CHANGE – PROD SAFE)
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

    // ⭐ Ratings
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    // 💼 MONETIZATION CORE (future proof)
    planType: {
      type: String,
      enum: ["free", "featured", "premium"],
      default: "free",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    featuredTill: {
      type: Date,
      default: null,
    },

    expiryDate: {
      type: Date,
      default: null,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // 📊 Analytics (sell proof)
    viewsCount: {
      type: Number,
      default: 0,
    },

    contactClicks: {
      type: Number,
      default: 0,
    },

    // 💳 Payment history (manual / future gateway)
    lastPayment: {
      amount: { type: Number, default: 0 },
      date: { type: Date, default: null },
      method: {
        type: String,
        default: "", // UPI / Cash / Online
      },
    },

    // ⏰ Availability
    mealTimings: {
      lunch: { type: String, default: "" },
      dinner: { type: String, default: "" },
    },

    // ✅ Trust
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 REQUIRED INDEXES (SAFE)
ownerSchema.index({ location: "2dsphere" });
ownerSchema.index({ isFeatured: 1, featuredTill: 1 });
ownerSchema.index({ expiryDate: 1 });

const Owner =
  mongoose.models.Owner || mongoose.model("Owner", ownerSchema);

export default Owner;
