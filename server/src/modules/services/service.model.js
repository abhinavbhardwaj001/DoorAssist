import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderProfile",
      required: true,
      index: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    pricingType: {
      type: String,
      enum: ["fixed", "starting_from", "on_request"],
      default: "fixed",
      required: true,
    },

    price: {
      type: Number,
      min: 0,
    },

    durationMinutes: {
      type: Number,
      min: 15,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    imagePublicId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Helps find services by provider and category
serviceSchema.index({
  providerId: 1,
  categoryId: 1,
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
