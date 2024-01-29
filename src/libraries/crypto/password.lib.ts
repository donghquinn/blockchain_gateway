import { randomBytes } from "crypto";

const createTokenBase = ( ) => randomBytes( 16 ).toString("base64");

export const cryptPassword = ( password: string ) => {
    const base = createTokenBase();

    const baseString = base + password;

    const encodedPassword = Buffer.from( baseString ).toString( "base64" )
    
    return encodedPassword;
};

export const cryptPrivateKey = ( privateKey: string ) =>
{
    const base = createTokenBase();

    const baseString = base + privateKey;

    const encodedPrivateKey = Buffer.from( baseString ).toString( "base64" );

    return encodedPrivateKey;
};

export const cryptPasswordAndPk = ( password: string, privateKey: string ) =>
{
    const cryptedPassword = cryptPassword( password );
    const cryptedPrivateKey = cryptPrivateKey( privateKey );

    return {cryptedPassword, cryptedPrivateKey}
}