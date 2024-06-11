const shareButton = document.getElementById("shareButton");

shareButton.addEventListener("click", () => {
  if (navigator.share) {
    navigator
      .share({
        title: "Check out this page",
        text: "This is a great page you should visit!",
        url: "https://example.com",
      })
      .then(() => {
        console.log("Thanks for sharing!");
      })
      .catch((error) => {
        console.error("Error sharing:", error);
      });
  } else {
    alert("Your browser does not support the Web Share API.");
  }
});

document.addEventListener("contextmenu", function (event) {
  alert("Inspect Elements Not Allowed")
  event.preventDefault();
});
