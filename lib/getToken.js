import jwt from "jsonwebtoken";
export function genToken(secretKey) {
  if (!secretKey) throw new Error("Missing secret key");
   
  const payload = {
    nonce: Math.random().toString(36).slice(2),
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: "2m" });

  return token;
}
