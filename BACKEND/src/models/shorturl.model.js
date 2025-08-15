import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
  full_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  expiresAt: {
    type: Date,
    required: false,
    index: true,
  },
  qrCodeDataUrl: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: false,
  },
  geo_rules: [{
    countryCode: {
      type: String,
      required: true
    },
    redirectUrl: {
      type: String,
      required: true
    }
  }],
  defaultGeoUrl: {
    type: String,
    required: false
  },
  clickDetails: [{
    timestamp: { type: Date, default: Date.now },
    country: { type: String, required: true },
  }],

  type: {
    type: String,
    enum: ['standard', 'custom', 'protected', 'fire', 'location'], 
    default: 'standard' 
  }
}, {
  timestamps: true
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;
