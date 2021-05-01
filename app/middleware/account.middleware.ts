import {verify} from "jsonwebtoken";
import {DI} from "../server";
import {AccountEntities} from "../entities";
import {createAccessToken, createRefreshToken, setRefreshToken} from "../authorization";
import express from 'express';
const AccountRouter = express.Router();

AccountRouter.post("/refresh_token",async (req,res)=>{
    const refreshToken =req.cookies.jid;
    if(!refreshToken) {
        res.send({ok:false,accessToken:false})
    }
    let payload:any =null;
    try {
        payload =await verify(refreshToken,process.env.REFRESH_TOKEN_SECRET!);
        const user = await DI.orm.em.findOne(AccountEntities,{ id: payload.userId });
        if(!user) {
            res.send({ok:false,acessToken:""})
        }
        setRefreshToken(res,createRefreshToken(user));
        res.send({ok:true,accessToken:createAccessToken(user)});
    }catch(error) {
        res.send({ok:false,acessToken:""})
    }

})
export {AccountRouter}
