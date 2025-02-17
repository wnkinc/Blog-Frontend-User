// controllers/post.controller.js
const axios = require("axios");

/**
 * -------------- GET post ----------------
 */
const getPostBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/posts/${slug}`;
    const response = await axios.get(apiUrl);
    const { post, reactions } = response.data; // Backend already formats reactions

    if (!post) {
      return res.status(404).render("404", { title: "Post Not Found" });
    }

    // Filter out top-level comments
    const topLevelComments = post.comments.filter(
      (comment) => !comment.parentId
    );

    // Ensure replies are attached correctly
    topLevelComments.forEach((comment) => {
      comment.replies = post.comments.filter(
        (reply) => reply.parentId === comment.id
      );
    });

    console.log("Post fetched by slug:", post.content);

    // Render the post view with the post data & reactions
    res.render("newpost", {
      pageTitle: post.title,
      post,
      comments: topLevelComments, // Now includes replies
      reactions, // No need for manual defaults, backend handles this
    });
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    next(error); // Forward to error handling middleware
  }
};

/**
 * -------------- POST comment ----------------
 */
const postComment = async (req, res, next) => {
  const { slug } = req.params; // Get post slug from URL
  const { comment } = req.body; // Get comment content from form

  try {
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/comments/${slug}/user`;

    // Get tokens from cookies
    const accessToken = req.cookies.access_token;
    const idToken = req.cookies.id_token;

    // Ensure both tokens are present
    if (!accessToken || !idToken) {
      return res.status(401).json({ error: "Unauthorized: Missing tokens." });
    }

    // Send data to backend API
    await axios.post(
      apiUrl,
      {
        content: comment, // Comment text
        idToken: idToken, // Send ID Token to extract username
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send Access Token in headers
        },
      }
    );

    // Redirect back to the post page @ comments
    res.redirect(`/post/${slug}#comments`);
  } catch (error) {
    console.error("Error posting comment:", error);
    next(error); // Forward to error handling middleware
  }
};

/**
 * -------------- POST reply ----------------
 */
const postReply = async (req, res, next) => {
  const { slug } = req.params; // Get post slug from URL
  const { reply, commentId } = req.body; // Get reply content and parent comment ID

  try {
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/comments/${slug}/reply/user`;

    // Get tokens from cookies
    const accessToken = req.cookies.access_token;
    const idToken = req.cookies.id_token;

    // Ensure both tokens are present
    if (!accessToken || !idToken) {
      return res.status(401).json({ error: "Unauthorized: Missing tokens." });
    }

    // Send reply data to backend API
    await axios.post(
      apiUrl,
      {
        content: reply, // Reply text
        commentId, // Parent comment ID
        idToken, // ID Token for retrieving user info
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send Access Token in headers
        },
      }
    );

    // Redirect back to the post page @ replies section
    res.redirect(`/post/${slug}#comments`);
  } catch (error) {
    console.error("Error posting reply:", error);
    next(error); // Forward to error handling middleware
  }
};

/**
 * -------------- POST reactions FRONTEND ----------------
 */
const postReactions = async (req, res, next) => {
  try {
    const { allSelections } = req.body;
    console.log("Received multiple reactions:", allSelections);
    // forward to your backend server:
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/posts/reactions`;
    const response = await axios.post(apiUrl, { allSelections });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error posting multiple reactions:", error);
    next(error);
  }
};

/**
 * -------------- DELETE post ----------------
 */
async function deletePost(req, res, next) {
  const { id } = req.params; // Get post ID from request params

  try {
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/posts/${id}/delete`;

    // Get tokens from cookies
    const accessToken = req.cookies.access_token;

    // Ensure access token is present
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized: Missing token." });
    }

    // Make DELETE request to backend API
    const response = await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Send access token
      },
    });

    // Redirect back to profile after deletion
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error deleting post:", error.response?.data || error);
    next(error); // Forward to error handling middleware
  }
}

module.exports = {
  getPostBySlug,
  postComment,
  postReply,
  postReactions,
  deletePost,
};
