const app    = require("./app"),
      https  = require("https"),
      port   = normalizePort(process.env.PORT || "3000"),
      fs     = require("fs"),
      path   = require("path");

const options = {
  key: fs.readFileSync(path.join(__dirname, 'Openssl/server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'Openssl/server.crt'))
};

app.set("port", port)
const server = https.createServer(options, app).listen(port);

function normalizePort(val) {
  const port = parseInt(val, 10);
  
  if (isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
}

server.on("listening", () => {
  console.log(`server is listening for request on port ${server.address().port}`);
})