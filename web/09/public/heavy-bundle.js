const items = [];
for (let i = 0; i < 100000; i++) {
    items.push({ id: i, name: "Task " + i });
}

console.log("Heavy-bundle.js: loaded " + items.length + " items");

document.querySelectorAll("button").forEach(function (btn) {
    btn.addEventListener("click", function () {
        console.log("Button clicked");
    });
});