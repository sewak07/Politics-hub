import ActivityLog from "../model/ActivityLog.model.js";

export const createActivityLog = async ({
  action,
  message,
  actor,
  targetUser = null,
  post = null,
  comment = null,
  metadata = {},
}) => {
  try {
    await ActivityLog.create({
      action,
      message,
      actor,
      targetUser,
      post,
      comment,
      metadata,
    });
  } catch (err) {
    console.log("Activity Log Error:", err.message);
  }
};