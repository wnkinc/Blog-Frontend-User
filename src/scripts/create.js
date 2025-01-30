function adjustEditorHeight() {
  const editor = tinymce.get("post-editor");
  if (editor) {
    const editorContainer = document.querySelector(".editor-container");
    if (editorContainer) {
      let newHeight =
        window.innerHeight - editorContainer.getBoundingClientRect().top - 20;
      editor.theme.resizeTo("100%", newHeight);
    }
  }
}

window.addEventListener("resize", () => {
  const editor = tinymce.get("post-editor");
  if (editor) {
    // Example: resize to 80% of current window height
    // or any formula you like
    editor.theme.resizeTo("100%", window.innerHeight * 0.8);
  }
});

// Adjust height dynamically on window resize
window.addEventListener("resize", adjustEditorHeight);
