import { createAccessToken, createEmailToken, VerifyEmailToken } from "../../authorization";
import { DI } from "../../server";
import { AccountEntities, SignatureEntities } from "../../entities";
import { AccountPasswordChangeInput } from "../../types/graphes.types/accounts.graphs.types";
import argon2 from "argon2";
import {sendEmail} from "../../helper";
import { errors } from "../../validator";
const AccountBasics=async(Account:any)=>{
    return {
        name:Account.name,
        email:Account.email,
        id:Account.id,
        status:Account.status,
        terms_accepted:Account.status,
    }
}
export const accountInfo=async(account:any)=>{
    try{
    let accountLatest:any = await DI.em.findOne(AccountEntities, {id: account.id as string}, ['users','teams','company','subscription','company.socials','company.socials.details','company.address']);
    const template = await DI.TemplateRepository.findAll();
    let signature:any = await DI.SignatureRepository.find({account: accountLatest}, {populate:['properties','template','draft'],limit:20,offset:0}); //initialise with 20 only
    let users:any = await DI.UsersRepository.find({account: accountLatest}, {populate:['signature','socials','socials.details'],limit:20,offset:0}); //initialise with 20 only
    const basic =await AccountBasics(accountLatest)
    return {
        teams: accountLatest.teams,
        signatures: signature,
        company:accountLatest.company,
        users:users,
        subscription: accountLatest.subscription,
        template: template,
        account: basic,
        billing:null,
        accessToken: createAccessToken(account),
    }
    }catch(e){
        return { errors:[{field:"template",message:e.message}] };
    }
}
export const sendEmailForgot = async (account:AccountEntities, token:string) => {
    try {
        await sendEmail(
            account.email,'"Forgot Password Hub Widget" <info@signatureBuilder.com.au>',"Change Your Password",`Hi ${account.name} <a href="http://localhost:3000/auth/change-password/${token}">Change Password</a> with in 30 min, it will expire after that`
        );
        return

    } catch (e) {
        const response:any=await errors("email verification error",[e.code]);
        return response;
    }
}

export const AccountForgotPassword = async (email:string) => {
    try {
        const account = await DI.em.findOne(AccountEntities,{email:email});
        if(!account) {
            return {
                errors:[{
                    field:"email",
                    message:`${email} does not exist`
                }]
            }
        }else{
            const responseToken =createEmailToken(account,'30m');
            account.forgot_password_token = responseToken;
            await DI.em.persistAndFlush(account);
            await sendEmailForgot(account,responseToken);
            return {
                account:{
                    email:email
                }
            }
        }

    } catch (e) {
        return {
            errors:[{
                field:"database",
                message:e.code
            }]
        }
    }
}
export const AccountChangePassword = async (options:AccountPasswordChangeInput) => {
    try {
        const response:any = VerifyEmailToken(options.token); //verify token
        const account = await DI.em.findOne(AccountEntities,{ id: response.payload?.userId,forgot_password_token:options.token }); // check database entry

        if(!account||response.status=="failed"){
            return {
                errors:[{
                    field:"emailToken",
                    message:"Invalid Email Token"
                }]
            }
        }else{
            const hashedPassword = await argon2.hash(options.password);
            account!.password = hashedPassword;
            account!.forgot_password_token="";
            await DI.em.persistAndFlush(account);
            return {account:{
                    email:account.email
                }}
        }
    } catch (e) {
        return {
            errors:[{
                field:"System",
                message:"Cannot Perform the task due to system error"
            }]
        }
    }
}