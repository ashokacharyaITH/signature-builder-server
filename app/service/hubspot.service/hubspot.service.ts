import Stripe from "stripe";
import { DI } from "../../server";
import { AccountEntities, UsersEntities } from "../../entities";
const axios = require('axios').default;
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client();
export const hubspotProvideAuthUrl=async ()=>{
    return hubspotClient.oauth.getAuthorizationUrl(process.env.HUBSPOT_CLIENT_ID,process.env.HUBSPOT_REDIRECT_URL, process.env.HUBSPOT_SCOPE);
}
export const isTokenExpired = async (updatedAt:Date,expiresIn:number) => {
    const updated= new Date(updatedAt as any).getTime();
    return Date.now() >= updated + expiresIn * 1000

}
export const refreshTokenFunction = async (refreshToken:string) => {
    try {
        const result = await hubspotClient.oauth.defaultApi.createToken(
            'refresh_token',
            undefined,
            undefined,
            process.env.HUBSPOT_CLIENT_ID,
            process.env.HUBSPOT_CLIENT_SECRET,
            refreshToken,
        )

        return {status:"success",data:result.body};
    }catch (e) {
        return {status:"error"};
    }
}
export const hubspotCreateRefreshToken=async (code:any)=>{
    try{
        const getTokensResponse = await hubspotClient.oauth.defaultApi.createToken(
            'authorization_code',
            code,
            process.env.HUBSPOT_REDIRECT_URL,
            process.env.HUBSPOT_CLIENT_ID,
            process.env.HUBSPOT_CLIENT_SECRET,
        )

        if (getTokensResponse.body) {
            hubspotClient.setAccessToken(getTokensResponse.body.accessToken)

            // const response = await hubspotClient.apiRequest({
            //     method: 'GET',
            //     path: '/oauth/v1/access-tokens/'+getTokensResponse.body.accessToken,
            // })

            const owner = await axios.get('https://api.hubapi.com/oauth/v1/access-tokens/'+getTokensResponse.body.accessToken);
             if(owner.data){
                 return {
                     status:"success",
                     token:{
                         accessToken:getTokensResponse.body.accessToken,
                         refreshToken:getTokensResponse.body.refreshToken,
                         expiresIn:getTokensResponse.body.expiresIn
                     },
                     details:{
                        email:owner.data.user,
                        companyUrl:owner.data.hub_domain
                     }
                 }
             }else{
                 return {errors:[{field:"hubspot",message:"No User associated"}]}
             }



        } else {
            return {errors:[{field:"hubspot",message:"Invalid code supplied"}]}
        }
    }catch(e){
        return {errors:[{field:"hubspot",message:e.message}]}
    }

}

export const hubspotListUser=async(accountEnt:AccountEntities,limit?:Number|undefined,cursor?:String|undefined)=>{
    try {
        console.log(accountEnt.email,"account mate")
        const account = await DI.em.findOne(AccountEntities, {email: accountEnt.email as string},['hub_token']);

        const refreshToken: any = account!.hub_token!.token;
        const expiry: any = account!.hub_token!.expiry;
        const updatedAt: any = account!.hub_token!.updatedAt;
        const istokenexpire: any = await isTokenExpired(updatedAt, expiry);
        if (istokenexpire) {
            const response = await refreshTokenFunction(refreshToken);
            if (response.status == "error") {
                return {errors: [{field: "hubspot", message: "Invalid refresh token supplied"}]}
            }
            hubspotClient.setAccessToken(response!.data!.accessToken)
            account!.hub_token!.expiry = response!.data!.expiresIn
            account!.hub_token!.token = response!.data!.refreshToken
            account!.hub_token!.accessToken = response!.data!.accessToken
            await DI.em.persistAndFlush(account as any);
        } else {
            hubspotClient.setAccessToken(account!.hub_token?.accessToken)
        }
        let response: any;
        if (cursor) {
            console.log("i am cursor")
            response = await hubspotClient.apiRequest({
                method:"GET",
                path: '/crm/v3/owners/',
                qs:{
                    limit:limit,
                    after:cursor

                }
            });
        } else {
            response = await hubspotClient.apiRequest({
                method:"GET",
                path: '/crm/v3/owners/',
                qs:{
                    limit:limit

                }
            });
        }
        const newList =[];
        for(let i=0;i<response.body.results.length;i++) {
            const user =response.body.results[i];
            const checkUser: any = await DI.em.findOne(UsersEntities, {email: user.email}, ['account','linkedPlatform', 'linkedPlatform.token']);
            if (checkUser) {
                const isAlreadyLinked: any = checkUser.linkedPlatform.toArray().filter((item: any) => {
                    return item.token.tokenType === "gmail"
                })
                if (isAlreadyLinked) {
                   user.linked_google=true; // is already google linked
                }
               if(checkUser.account){
                   user.has_owner=true;  //has already owner ask for permission
                   user.owner=checkUser.account.id
                   if(checkUser.account.id===account!.id){
                       user.owner="me"
                   }

               }
            }
            newList.push(user)
        }
        return {list:  newList, cursor: response.body.paging?response.body.paging.next.after:null}
    }catch(e){
        console.log(e)
        return {errors:[{field:"hubspot",message:e.message}]}
    }
}