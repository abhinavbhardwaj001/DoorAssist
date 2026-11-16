import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderProfile",
      required: true,
      index: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    address: {
      addressLine: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },
    },

    customerNote: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Service details snapshot at the time of booking
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "payment_pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
      required: true,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["not_required", "pending", "success", "failed"],
      default: "not_required",
      required: true,
      index: true,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    acceptedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient booking queries
bookingSchema.index({
  providerId: 1,
  scheduledAt: -1,
});

bookingSchema.index({
  customerId: 1,
  scheduledAt: -1,
});

bookingSchema.index({
  providerId: 1,
  status: 1,
  scheduledAt: 1,
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
