import tls from "tls";

const domain = "google.com";

const socket = tls.connect(443, domain, { servername: domain }, () => {
  const cert = socket.getPeerCertificate();
  console.log(cert);
  socket.end();
});

socket.on("error", (err) => {
  console.error("SSL check failed:", err.message);
});
