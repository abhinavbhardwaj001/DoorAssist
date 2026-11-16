import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
  },
  { _id: false },
);

availabilitySchema.pre("validate", function () {
  if (this.startTime && this.endTime && this.endTime <= this.startTime) {
    this.invalidate("endTime", "End time must be later than start time");
  }
});

const providerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    experienceYears: {
      type: Number,
      min: 0,
      max: 60,
      required: true,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    profileImage: {
      type: String,
      trim: true,
      default: "",
    },

    profileImagePublicId: {
      type: String,
      default: "",
    },

    serviceAreas: {
      type: [
        {
          city: {
            type: String,
            trim: true,
            required: true,
            maxlength: 100,
          },
          state: {
            type: String,
            trim: true,
            required: true,
            maxlength: 100,
          },
        },
      ],
      required: true,
      validate: {
        validator: (areas) => areas.length > 0,
        message: "At least one service area is required",
      },
    },
    availability: {
      type: [availabilitySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

providerProfileSchema.index({
  "serviceAreas.city": 1,
  "serviceAreas.state": 1,
  verificationStatus: 1,
});

const ProviderProfile = mongoose.model(
  "ProviderProfile",
  providerProfileSchema,
);

export default ProviderProfile;
