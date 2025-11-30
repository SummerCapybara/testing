const fs = require("fs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");


const httpServer = http.createServer((req, res) => {

   const filePath = path.join(
        __dirname,
        req.url === "/" ? "index.html" : req.url
    );

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Server error");
            return;
        }

        const ext = path.extname(filePath);
        let contentType = "text/plain";

        if (ext === ".html") contentType = "text/html";
        if (ext === ".js") contentType = "application/javascript";
        if (ext === ".css") contentType = "text/css";

        res.writeHead(200, { "Content-Type": contentType });
        res.end(data, "utf-8");
    });
});

const io = new Server(httpServer);

io.on("connection", (socket) => {

    let ip_adress = socket.handshake.headers["x-forwarded-for"];

    socket.on("msg", (msg) => {

        console.log("message recieved: ", msg);

        io.sockets.sockets.forEach(client => {

            client.emit("messageRecieved", `${msg} : ${ip_adress}`);
        });
    });
});

const port = 5000;

httpServer.listen(port, () => console.log("running on ", port))