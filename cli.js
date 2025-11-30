const socket = io("https://hypolimnetic-tobie-unplayed.ngrok-free.dev");

const input = document.querySelector(".in");
const b = document.querySelector(".button");
const ul = document.querySelector("ul");



b.onclick = () => {
    const msg = input.value;
    if (msg) {
        socket.emit("msg", msg);
        input.value = '';
    };
};
socket.on("messageRecieved", (msg) => {
    let li = document.createElement("li");
    li.textContent = msg;
    ul.appendChild(li);
});