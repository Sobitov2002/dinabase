import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: "public_xyn9SKy/R0uODN6qsmni/yvenv4=", // O'z publicKey'ingizni kiriting
  privateKey: "private_1M+YLEWx7XOcLnDCc47dupEHwTQ=", // O'z privateKey'ingizni kiriting
  urlEndpoint: "https://ik.imagekit.io/njtthrpue", // URL endpoint
});

app.get("/imagekit-auth", (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
});

