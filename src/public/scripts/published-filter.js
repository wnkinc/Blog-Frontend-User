document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".filter-tab");
  const posts = Array.from(document.querySelectorAll(".feed-post"));

  function filterPosts(filterType) {
    posts.forEach((post) => {
      // Convert the data attribute to a boolean for comparison
      const isPublished = post.getAttribute("data-published") === "true";
      if (filterType === "published") {
        post.style.display = isPublished ? "" : "none";
      } else if (filterType === "draft") {
        post.style.display = !isPublished ? "" : "none";
      } else {
        // Default: show all
        post.style.display = "";
      }
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs and add to the clicked one
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Get the filter type from the data attribute of the button
      const filterType = this.getAttribute("data-filter");
      filterPosts(filterType);
    });
  });
});
