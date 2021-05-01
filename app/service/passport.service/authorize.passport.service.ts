import passport from "passport";
import argon2 from "argon2";

import { DI } from '../../server';
const authoriseAccount= async (email:string,password:string) => {

    const account:any = await DI.AccountRepository.findOne({email:email},['signatures','hub_token','company','company.socials','company.address','subscription']);

    if(!account) {
        return {
            errors:[{
                field:"email",
                message:"that email doesnot exist"
            }],
            user:null
        }
    }
    const valid = await argon2.verify(account.password,password);
    if(!valid) {
        return {
            errors:[{
                field:"password",
                message:"password didnt match"
            }],
            user:null
        }
    }


    return {account}
}
export async function authorizeJWT(context:any, next:any):Promise<any>{
    return new Promise(function(resolve, reject){
        passport.authenticate("jwt", (err, account,token) => {
            if (!account || err) {
                resolve({ status: "error", code: "unauthorized" });
            } else {
                resolve({status:"success",accessToken:token,account:account} as any);
            }
        })(context.req, context.res, next);
    });
}
export async function authorizeLocal(context:any,arg:any):Promise<any>{
    return new Promise(function(resolve, reject){
        const response = authoriseAccount(arg.options.email,arg.options.password)
        resolve(response);
    });
}
