import { errors} from "../../validator";
import {DI} from "../../server";
import {
    AccountEntities, AccountProfileEntities, AddressEntities, CompanyEntities, OwnerSocialType,
    OwnerTokenType,
    PasswordHistoryEntities, SocialDetailsEntities, SocialsEntities,
    SubscriptionEntities, TemplateEntities,
    TokenEntities,
    TokenType, UsersEntities
} from "../../entities";
import { onBoardFormInput, OnBoardProfileInput } from "../../types";
import argon2 from "argon2";
import { initializeStripeService } from "../stripe.service";
import { emailSend } from "../email.service";
import { googleGenerateAuthLink } from "../google.service";
import { UserAdd, UserCreate } from "./user.service";
import { SubscriptionCreateService } from "./subscription.service";

export const OnBoardHubspotService = async(tokenResponse:any) => {
    try {
     if(tokenResponse){
         const account = await DI.em.findOne(AccountEntities, {email: tokenResponse.details.email as string},['hub_token']);
         if(account){
             if(account.status!="form"){
                 console.log(account.status,"i am here mate wow")
                 return { errors:[{field:"hubspot",message:"Account already exists"}] };
             }

             //has password then return null
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
             account.status="form";
             await DI.em.persistAndFlush(account);
         }else{
             const account =new AccountEntities({email:tokenResponse.details.email},"hubspot");
             const token =new TokenEntities({token:tokenResponse.token.refreshToken,accessToken:tokenResponse.token.accessToken,expiry:tokenResponse.token.expiresIn,tokenType:TokenType.hubspot})
             token.account=account;
             account.hub_token=token;
             account.status="form";
             account.buffer=tokenResponse.details.companyUrl;
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
                account.status="profile";
                account.terms_accepted=option.terms_accepted;
                const profile =await new AccountProfileEntities({account:account}) //set profile
                account.profile =profile;
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
export const OnBoardProfileService = async(option:any) => {
    try {
        if(option.account){
            const account:any = await DI.em.findOne(AccountEntities, {id: option.account.id as string},['profile']);
            const profile:any =new AccountProfileEntities({mobile:option.mobile,phone:option.phone,role:option.role,account:account});
            for(let i=0;i<option.socials.length;i++){
                const optionSocials=option.socials[i];
                const detail=await DI.em.findOne(SocialDetailsEntities, {id: optionSocials.id as string});
                if(detail){
                    const social=new SocialsEntities({link:optionSocials.link,details:optionSocials.id,ownerType:OwnerSocialType.profile,profile:profile})
                    social.details=optionSocials.id;
                    profile!.socials!.add(social);
                }
            }
                account!.profile=profile;
                account.status="company";

                await DI.em.persistAndFlush( account);
                return {account:account};
            }
            return { errors:[{field:"link",message:"No account found"}] };
        }
      catch (err) {
        return { errors:[{field:"link",message:err.message}] };
    }
}
export const OnBoardCompanyService = async(option:any) => {
    try {
            const account:any = await DI.em.findOne(AccountEntities, {id: option.account.id as string},['company','company.socials','company.address']);
              const company:any =new CompanyEntities({name:option.name,image:option.image,phone:option.phone,url:option.url,footnote:option.footnote,account:account});
            for(let i=0;i<option.address.length;i++){
                const optionAddress=option.address[i];
                const address=new AddressEntities({street:optionAddress.street,post_code:optionAddress.post_code,state:optionAddress.state,country:optionAddress.country,isDefault:optionAddress.isDefault,company:company})
                company!.address!.add(address);
            }
            for(let i=0;i<option.socials.length;i++){
                const optionSocials=option.socials[i];
                const detail=await DI.em.findOne(SocialDetailsEntities, {id: optionSocials.id as string});
                if(detail){
                    const social=new SocialsEntities({link:optionSocials.link,details:optionSocials.id,ownerType:OwnerSocialType.company,company:company})
                    social.details=optionSocials.id;
                    company!.socials!.add(social);
                }
            }
             account!.company=company;
            account!.status="subscription";
            await DI.em.persistAndFlush(account as any);
            return {company:account!.company,account:account}
            return { errors:[{field:"company",message:"Company Already Present"}] };

    } catch (err) {
        return { errors:[{field:"link",message:err.message}] };
    }
}
export const OnBoardImportService= async(option:any) => {
    try {
        let account = await DI.em.findOne(AccountEntities, {email: option.account.email as string}, ['users','subscription']);
        const template = await DI.em.findAndCount(TemplateEntities, {},{limit:20,offset:0});
        let userCount=0;
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
                        userCount++;
                    }

                }
            }else{ // no users presents
                const response = await UserCreate(user,account);
                if(!response.errors){
                    account =response.account;
                    userCount++;
                }
            }


        }
        account!.subscription!.inUse=userCount;
        account!.status="completed";
        await DI.em.persistAndFlush(account as any);
        return {users: account!.users,account:account,subscription:account!.subscription,template:template}
    } catch (err) {
        return { errors:[{field:"import",message:err.message}] };
    }
}
export const OnBoardSubscriptionService= async(option:any) => {
    try {
        let account = await DI.em.findOne(AccountEntities, {id: option.account.id as string}, ['users']);
        const subscriptionResponse:any =await SubscriptionCreateService(option);
        if(subscriptionResponse.errors){
            return subscriptionResponse
        }

        account!.status=subscriptionResponse.subscription.status=="active"?"import":"subscription";
        await DI.em.persistAndFlush(account as any);
        return {...subscriptionResponse,account:account};
    } catch (err) {
        return { errors:[{field:"subscription",message:err.message}] };
    }
}