// throw new Error("boot failed");

document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js loaded and running");
  fetch("/api/time")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("time").textContent = `Server time: ${data.time}`;
      console.log("Server time:", data.time);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  fetch("/api/ping")
    .then((r) => r.text())
    .then(console.log)
    .catch(console.error);

  // fetch("https://api.invalid.local/ping")
  //   .then((r) => r.json())
  //   .then(console.log)
  //   .catch(console.error);
});
