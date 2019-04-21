const app    = require("./app"),
      http  = require("http"),
      port   = normalizePort(process.env.PORT || "3000");

app.set("port", port)
const server = http.createServer(app).listen(port);

function normalizePort(val) {
  const port = parseInt(val, 10);
  
  if (isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
}

server.on("listening", () => {
  console.log(`server is listening for request on port ${server.address().port}`);
})