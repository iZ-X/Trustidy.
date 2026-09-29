import tls from "tls";

export function getSSLIssuer(domain) {
  return new Promise((resolve) => {
    const socket = tls.connect(
      443,
      domain,
      { servername: domain, timeout: 5000 },
      () => {
        const cert = socket.getPeerCertificate();
        socket.end();
        resolve(cert.issuer?.O ?? null);
      },
    );

    socket.on("error", () => {
      resolve(null);
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(null);
    });
  });
}
