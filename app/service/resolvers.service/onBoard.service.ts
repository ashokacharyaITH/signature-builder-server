import { errors} from "../../validator";
import {DI} from "../../server";
import {
    AccountEntities, AddressEntities, CompanyEntities, OwnerSocialType,
    OwnerTokenType,
    PasswordHistoryEntities, SocialDetailsEntities,
    SocialsEntities,
    TokenEntities,
    TokenType, UsersEntities
} from "../../entities";
import { onBoardFormInput} from "../../types";
import argon2 from "argon2";
import { initializeStripeService } from "../stripe.service";
import { emailSend } from "../email.service";
import { googleGenerateAuthLink } from "../google.service";
import { UserAdd, UserCreate } from "./user.service";
export const OnBoardHubspotService = async(tokenResponse:any) => {
    try {
     if(tokenResponse){
         const account = await DI.em.findOne(AccountEntities, {email: tokenResponse.details.email as string},['hub_token']);
         if(account){
             if(account!.hub_token!.token){
                 account.hub_token!.token=tokenResponse.token.refreshToken;
                 account.hub_token!.expiry=tokenResponse.token.expiresIn;
                 account.hub_token!.accessToken=tokenResponse.token.accessToken;
                 account.hub_token!.tokenType=TokenType.hubspot;
                 account.hub_token!.ownerType=OwnerTokenType.account;
             }else{
                 const token =new TokenEntities({token:tokenResponse.token.refreshToken,accessToken:tokenResponse.token.accessToken,expiry:tokenResponse.token.expiresIn,tokenType:TokenType.hubspot})
                 token.account=account;
                 account.hub_token=token;
             }
             account.buffer=tokenResponse.details.companyUrl;
             await DI.em.persistAndFlush(account);
         }else{
             const account =new AccountEntities({email:tokenResponse.details.email},"hubspot");
             const token =new TokenEntities({token:tokenResponse.token.refreshToken,accessToken:tokenResponse.token.accessToken,expiry:tokenResponse.token.expiresIn,tokenType:TokenType.hubspot})
             token.account=account;
             account.hub_token=token;
             await DI.em.persistAndFlush([token,account]);

         }

         return {email:tokenResponse.details.email,companyUrl:''};
     }
        return { errors:[{field:"link",message:"No token provided"}] };
    } catch (err) {
        return { errors:[{field:"link",message:err.message}] };
    }
}

export const OnBoardFormService = async(option:onBoardFormInput) => {
    try {
        if(option.email&&option.name&&option.password){
            const account = await DI.em.findOne(AccountEntities, {email: option.email as string},['hub_token']);
            if(account){
                const hashedPassword = await argon2.hash(option.password);
                account.name=option.name;
                account.password=hashedPassword;
                account.status="form";
                account.terms_accepted=option.terms_accepted;
                const passwordHistory =new PasswordHistoryEntities({password:account.password,account:account})
                account.password_history!.add(passwordHistory);
                const customer = await initializeStripeService.customers.create({email: option.email});
                account.stripe_customer_id=customer.id;
                await DI.em.persistAndFlush([passwordHistory,account]);
                return {account:account};
            }

            return { errors:[{field:"link",message:"Please Connect to Hubspot First"}] };
        }
        return { errors:[{field:"link",message:"No Details provided for onboarding"}] };
    } catch (err) {
        return { errors:[{field:"link",message:err.message}] };
    }
}
export const OnBoardCompanyService = async(option:any) => {
    try {

        if(option.accountEmail&&option.name&&option.url&&option.phone&&option.address){
            const account = await DI.em.findOne(AccountEntities, {email: option.accountEmail as string});
            if(!account!.company){
                 const company =new CompanyEntities({name:option.name,image:option.image,phone:option.phone,footnote:option.footnote,account:account});
                for(let i=0;i<option.address.length;i++){
                    const optionAddress=option.address[i];
                    const address=new AddressEntities({street:optionAddress.street,post_code:optionAddress.post_code,state:optionAddress.state,country:optionAddress.country,isDefault:optionAddress.isDefault,company:company})
                    company!.address!.add(address);
                }
                for(let i=0;i<option.socials.length;i++){
                    const optionSocials=option.socials[i];
                    const detail=await DI.em.findOne(SocialDetailsEntities, {id: optionSocials.id as string});
                    const socials=new SocialsEntities({link:optionSocials.link,details:detail,company:company,ownerType:OwnerSocialType.company});
                    company!.socials!.add(socials);
                }
                account!.company=company;
                await DI.em.persistAndFlush(account as any);
                return {company:account!.company}
            }
            return { errors:[{field:"company",message:"Company Already Present"}] };
        }
        return { errors:[{field:"link",message:"No Details provided for onboarding"}] };
    } catch (err) {
        return { errors:[{field:"link",message:err.message}] };
    }
}
export const OnBoardImportService= async(option:any) => {
    try {
        let account = await DI.em.findOne(AccountEntities, {email: option.account.email as string}, ['users']);
        for (var i = 0; i < option.users.length; i++) {
            const user = option.users[i];
            const finduser:any=await DI.em.findOne(UsersEntities, {email: user.email},['linkedPlatform','linkedPlatform.token']);
            if(finduser){ //user presents
                if(user.has_owner){ // has owner but i am not
                    if(user.owner!="me"){
                        //sent email for asking ownership, once getting ownsership sent email for google link and update account
                        emailSend(
                            user.email, '"Provide ownership to" <info@signaturebuilder.com.au>', "Please provide ownershio", `Hi ${user.name} Please provide ownership to ${account!.email}</a>`
                        );
                    }
                    //do nothing if owner is me.
                }else{ //is orphan
                    const response = await UserAdd(option,user,account);
                    if(!response.errors){
                        account =response.account;
                    }
                }
            }else{ // no users presents
                const response = await UserCreate(user,account);
                if(!response.errors){
                    account =response.account;
                }
            }


        }
        await DI.em.persistAndFlush(account as any);
        return {users: account!.users}
    } catch (err) {
        return { errors:[{field:"import",message:err.message}] };
    }
}