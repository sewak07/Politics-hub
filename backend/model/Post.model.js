import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },

    content: {
      type: String,
      required: true,
    },

    media: [
      {
        type: {
          type: String,
          enum: ["image", "video", "pdf"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          default: null,
        },
      },
    ],

    category: {
      type: String,
      required: true,
      enum: ["national", "international", "economy", "election", "opinion", "other"],
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ✅ SAFE DEFAULT ADDED (IMPORTANT FIX)
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ✅ SAFE VIRTUAL (NO CRASH EVER)
postSchema.virtual("likeCount").get(function () {
  if (!Array.isArray(this.likes)) return 0;
  return this.likes.length;
});

// include virtuals in JSON
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

const Post = mongoose.model("Post", postSchema);
export default Post;