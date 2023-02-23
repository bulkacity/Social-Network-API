const { Post, User } = require("../models");

const PostController = {
  // get all Posts
  getAllPost(req, res) {
    Post.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one Post by id
  getPostById({ params }, res) {
    Post.findOne({ _id: params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((dbPostData) => {
        if (!dbPostData) {
          return res.status(404).json({ message: "No Post with this id!" });
        }
        res.json(dbPostData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create Post
  // push the created Post's _id to the associated user's Posts array field
  createPost({ params, body }, res) {
    Post.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { Posts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Post created but no user with this id!" });
        }

        res.json({ message: "Post successfully created!" });
      })
      .catch((err) => res.json(err));
  },

  // update Post by id
  updatePost({ params, body }, res) {
    Post.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: "No Post found with this id!" });
          return;
        }
        res.json(dbPostData);
      })
      .catch((err) => res.json(err));
  },

  // delete Post
  deletePost({ params }, res) {
    Post.findOneAndDelete({ _id: params.id })
      .then((dbPostData) => {
        if (!dbPostData) {
          return res.status(404).json({ message: "No Post with this id!" });
        }

        // remove Post id from user's `Posts` field
        return User.findOneAndUpdate(
          { Posts: params.id },
          { $pull: { Posts: params.id } }, //$pull removes from an existing values that match a specified condition.
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Post created but no user with this id!" });
        }
        res.json({ message: "Post successfully deleted!" });
      })
      .catch((err) => res.json(err));
  },

  // add reaction
  addReaction({ params, body }, res) {
    Post.findOneAndUpdate(
      { _id: params.PostId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: "No Post with this id" });
          return;
        }
        res.json(dbPostData);
      })
      .catch((err) => res.json(err));
  },

  // delete reaction
  removeReaction({ params }, res) {
    Post.findOneAndUpdate(
      { _id: params.PostId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => res.json(err));
  },
};

module.exports = PostController;