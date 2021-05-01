import {AccountEntities} from "../../entities";
import {sign, verify} from "jsonwebtoken";
import {Response} from "express";

export const createAccessToken = (account:AccountEntities|null) => {
    return sign({accountId:account!.id},process.env.ACCESS_TOKEN_SECRET!,{expiresIn:'2d'}) // user has 15 minutes of playing time /2d for testing
}

export const createRefreshToken = (account:AccountEntities|null) => {
    return sign({accountId:account!.id,tokenVersion:account!.refresh_token_version},process.env.REFRESH_TOKEN_SECRET!,{expiresIn:'7d'}) // user can cash in for 7 days (refresh in each cash)) after that they have to loginin again
}
export const setRefreshToken = (res:Response,token:string) => {
    return res.cookie("jid",token,{httpOnly:true,maxAge:31536000}); // set for year
}
export const clearRefreshToken = (res:Response) => {
    return res.clearCookie('jid');
}
export const createEmailToken = (account:AccountEntities|null, time:string) => {
    return sign({accountEmail:account!.email,userId:account!.id},process.env.EMAIL_TOKEN_SECRET!,{expiresIn:time})
}
export const VerifyEmailToken = (token:string) => {
    try {
        const payload:any = verify(token,process.env.EMAIL_TOKEN_SECRET!);
        return {status:"success",payload:payload};
    }
    catch (e) {
        return {
            status:"failed"
        }
    }
}
