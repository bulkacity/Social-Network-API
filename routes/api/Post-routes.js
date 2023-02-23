const router = require("express").Router();
const {
  getAllPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addReaction,
  removeReaction,
} = require("../../controllers/Post-controller");

// /api/Posts
router.route("/")
.get(getAllPost)
.post(createPost);

// /api/Posts/:id
router
  .route("/:id")
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

// /api/Posts/:PostId/reactions
router.route("/:PostId/reactions")
.post(addReaction);

// /api/Posts/:PostId/reactions/:reactionId
router.route("/:PostId/reactions/:reactionId")
.delete(removeReaction);

module.exports = router;