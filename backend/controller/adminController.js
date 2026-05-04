import User from "../model/User.model.js";
import Post from "../model/Post.model.js";
import { createActivityLog } from "../utils/createActivityLog.js";

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PROMOTE USER → ADMIN
export const promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    // 🔥 LOG
    await createActivityLog({
      action: "USER_PROMOTED",
      message: `Promoted ${user.username} to admin`,
      actor: req.user._id,
      targetUser: user._id,
    });

    res.json({ message: "User promoted to admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DEMOTE ADMIN → USER
export const demoteAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "user";
    await user.save();

    // 🔥 LOG
    await createActivityLog({
      action: "USER_DEMOTED",
      message: `Demoted ${user.username} to user`,
      actor: req.user._id,
      targetUser: user._id,
    });

    res.json({ message: "Admin demoted to user" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get admin stats
export const getAdminStats = async (req, res) => {
  try {
    const now = new Date();

    const timeRanges = {
      last24h: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      last7d: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      last30d: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      last1y: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
    };

    // USERS
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: timeRanges.last24h },
    });

    const newUsersWeek = await User.countDocuments({
      createdAt: { $gte: timeRanges.last7d },
    });

    // POSTS 
    const totalPosts = await Post.countDocuments();

    const posts24h = await Post.countDocuments({
      createdAt: { $gte: timeRanges.last24h },
    });

    const posts7d = await Post.countDocuments({
      createdAt: { $gte: timeRanges.last7d },
    });

    const posts30d = await Post.countDocuments({
      createdAt: { $gte: timeRanges.last30d },
    });

    // LIKES 
    const likesAgg = await Post.aggregate([
      {
        $project: {
          likesCount: {
            $cond: [
              { $isArray: "$likes" },
              { $size: "$likes" },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likesCount" },
        },
      },
    ]);

    const totalLikes = likesAgg[0]?.totalLikes || 0;

    // ENGAGEMENT 
    const engagement = totalLikes;

    const engagementRate =
      totalPosts > 0 ? (engagement / totalPosts).toFixed(2) : 0;

    // POSTS BY ADMIN 
    const postsByAdmin = await Post.aggregate([
      {
        $group: {
          _id: "$author",
          total: { $sum: 1 },
          last24h: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", timeRanges.last24h] }, 1, 0],
            },
          },
          last7d: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", timeRanges.last7d] }, 1, 0],
            },
          },
          last30d: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", timeRanges.last30d] }, 1, 0],
            },
          },
          last1y: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", timeRanges.last1y] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          _id: 0,
          userId: "$author._id",
          username: "$author.username",
          total: 1,
          last24h: 1,
          last7d: 1,
          last30d: 1,
          last1y: 1,
        },
      },
    ]);

    // CATEGORY STATS 
    const categoryStats = await Post.aggregate([
      {
        $project: {
          category: 1,
          likesCount: {
            $cond: [
              { $isArray: "$likes" },
              { $size: "$likes" },
              0,
            ],
          },
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: "$category",

          total: { $sum: 1 },

          totalLikes: { $sum: "$likesCount" },

          last24h: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", timeRanges.last24h] },
                1,
                0,
              ],
            },
          },

          last7d: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", timeRanges.last7d] },
                1,
                0,
              ],
            },
          },

          last30d: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", timeRanges.last30d] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
          totalLikes: 1,
          last24h: 1,
          last7d: 1,
          last30d: 1,
        },
      },
      { $sort: { totalLikes: -1 } },
    ]); 

    //TRENDING POSTS
    const trendingPosts = await Post.aggregate([
      {
        $project: {
          title: 1,
          category: 1,
          likesCount: {
            $cond: [
              { $isArray: "$likes" },
              { $size: "$likes" },
              0,
            ],
          },
        },
      },
      { $sort: { likesCount: -1 } },
      { $limit: 5 },
    ]);

    // PEAK HOUR 
    const peakHourData = await Post.aggregate([
      {
        $project: {
          hour: { $hour: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const peakHour = peakHourData[0]?._id ?? null;

    // LIKE BY ADMIN (FIXED ORDER)
    const likesByAdmin = await Post.aggregate([
      {
        $group: {
          _id: "$author",
          totalLikes: {
            $sum: {
              $cond: [
                { $isArray: "$likes" },
                { $size: "$likes" },
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          _id: 0,
          userId: "$author._id",
          username: "$author.username",
          totalLikes: 1,
        },
      },
    ]);

    // RANKINGS
    const rankedAdminsByPosts = postsByAdmin
      .slice()
      .sort((a, b) => b.total - a.total)
      .map((a, i) => ({ ...a, rank: i + 1 }));

    const rankedCategories = categoryStats
      .slice()
      .map((c, i) => ({ ...c, rank: i + 1 }));

    const rankedAdminsByLikes = likesByAdmin
      .slice()
      .sort((a, b) => b.totalLikes - a.totalLikes)
      .map((a, i) => ({ ...a, rank: i + 1 }));

    // RESPONSE
    res.json({
      totalUsers,
      totalAdmins,
      newUsersToday,
      newUsersWeek,

      totalPosts,
      posts24h,
      posts7d,
      posts30d,

      totalLikes,
      engagement,
      engagementRate,

      postsByAdmin,
      categoryStats,
      trendingPosts,
      peakHour,

      rankedAdminsByPosts,
      rankedAdminsByLikes,
      rankedCategories,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};