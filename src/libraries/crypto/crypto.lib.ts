import { createCipheriv, randomBytes } from 'crypto';

export const cryptPassword = (password: string) => {
  const secretKey = process.env.SECRET_KEY!;
  const iv = randomBytes(16); // Initialization vector
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  const encrypted = cipher.update(password);

  const encryptedString = Buffer.concat( [ encrypted, cipher.final() ] ).toString( "hex" )
  

  return { passwordToken: iv.toString('hex'), encodedPassword: encryptedString };
};

export const cryptPrivateKey = (privateKey: string) => {
  const secretKey = process.env.SECRET_KEY!;
  const iv = randomBytes(16); // Initialization vector
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  const encrypted = cipher.update(privateKey);

  const encryptedString = Buffer.concat( [ encrypted, cipher.final() ] ).toString( "hex" )
  
  return { pkToken: iv.toString('hex'), encodedPrivateKey: encryptedString };
};
