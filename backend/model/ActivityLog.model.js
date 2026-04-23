import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "USER_PROMOTED",
        "USER_DEMOTED",
        "POST_CREATED",
        "POST_DELETED",
        "POST_UPDATED",
        "COMMENT_CREATED",
        "COMMENT_DELETED",
        "POST_LIKED",
        "POST_UNLIKED",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },

    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);