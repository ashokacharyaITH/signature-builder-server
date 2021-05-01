import { DI } from "../../server";
import { AccountEntities, LinkedPlatformEntities, TokenEntities, TokenType, UsersEntities } from "../../entities";
const url = require('url');

const {google} = require('googleapis');
const oauth2 = google.oauth2('v2');
const googleClient =async ()=>{
    const auth = await new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL);
    return  auth;
}
export const googleGenerateAuthLink=async (state:string) => {
    try{
        const client=await googleClient();
        const authUrl = client.generateAuthUrl({
            response_type:'code',
            access_type: 'offline',
            scope: process.env.GOOGLE_SCOPE,
            state: state
        });
        return {url:authUrl};
    }catch(e){
        return {errors:[{field:"google",message:e.message}]};
    }

}

const createToken=async (user:UsersEntities,refresh_token:string,expiry_date:any)=>{
    try {
        const tokens = new TokenEntities({token: refresh_token, expiry: expiry_date, tokenType: TokenType.gmail});
        const linkPlatform = new LinkedPlatformEntities({token: tokens, user: user, linked: true})
        user.linkedPlatform!.add(linkPlatform);
        user.isLinked=true;
        await DI.em.persistAndFlush(user as any);
        return {user: user}
    }catch(e){
        return {errors:[{field:"create token",message:e.message}]};
    }
}
export const googleVerify = async (options:any)=>{
    try{
        const state = decodeURIComponent(options.state);
        const code = options.code;
        const accountId =state.split("|")[0] // return from gmail auth redirect.
        const userEmail =state.split("|")[1] //return from gmail redirect.
        const client=await googleClient();
        const user=await DI.em.findOne(UsersEntities, {email: userEmail}, ['account']);
        if(user){
            const account=await DI.em.findOne(AccountEntities, {id: accountId}, ['users',"users.linkedPlatform","users.linkedPlatform.token"]);
            if(account){
                const active = account!.users!.toArray().filter(active=>active.email===user.email);
                if(active.length>0){

                    const activeUser =active[0];
                    if(activeUser.linkedPlatform){
                        const isAlreadyLinked:any = activeUser.linkedPlatform.filter((item:any)=>{
                            return item.token.tokenType ==="gmail"
                        })
                        if(isAlreadyLinked.length>0) {
                            return {errors:[{field:"user",message:"Email is already linked based on record"}]};  //email is already linked on that user email
                        }
                    }
                    const activeEmail =activeUser.email;
                    const tokenResponse=await client.getToken(code);
                    const token=tokenResponse.tokens;
                    const access_token=token.access_token?token.access_token:null;
                    const expiry_date=token.expiry_date?token.expiry_date:0;
                    const refresh_token:any=token.refresh_token?token.refresh_token:null;
                    if(!refresh_token){
                        return {errors:[{field:"user",message:"Email is already linked based on gmail token"}]};  //email is already linked on that user email because no refresh token
                    }
                    client.setCredentials({
                        access_token: access_token
                    });
                    const gmail = google.gmail('v1');
                    google.options({auth: client});
                    const res = await gmail.users.getProfile({auth:client,userId: "me" });
                    const outhEmail:string=res.data.emailAddress;
                    if(outhEmail===activeEmail){  //match the sent email with token email
                        //user is present and is not linked, so linked it
                        const checkuser:any=await DI.em.findOne(UsersEntities, {email: outhEmail});
                        const response = await createToken(checkuser,refresh_token,expiry_date)
                        return response;
                    }else{
                        //token email didnt match , so search the user
                        const finduser:any=await DI.em.findOne(UsersEntities, {email: outhEmail},['linkedPlatform','linkedPlatform.token']);
                        if(finduser){
                            //user is present, so check if its linked or not
                            const isAlreadyLinked:any = finduser.linkedPlatform.toArray().filter((item:any)=>{
                                return item.token.tokenType ==="gmail"
                            })
                            if(isAlreadyLinked||finduser.isLinked==true){
                                return {errors:[{field:"user",message:"Token Email is already linked"},{field:"user",message:"Sent email and token email didnt match"}]};
                            }
                            const response = await createToken(finduser,refresh_token,expiry_date)
                            if(response.errors){
                                return {errors:[response.errors[0],{field:"user",message:"Sent email and token email didnt match"}]};
                            }
                        }
                        //no user found so create one
                        const newuser =new UsersEntities({email:outhEmail,name:"",hub_id:"",account:null,isLinked:true});
                        const response = await createToken(newuser,refresh_token,expiry_date)
                        if(response.errors){
                            return {errors:[response.errors[0],{field:"user",message:"Sent email and token email didnt match"}]};  //tell doidnt match
                        }
                        return {errors:[{field:"user",message:"Sent email and token email didnt match"}]};  //tell doidnt match
                    }
                }
                return {errors:[{field:"user",message:"User is not Associated with account"}]}; // no user based on state
            }
            return {errors:[{field:"user",message:"No account Found"}]}; // no account  based on state
        }



        return {errors:[{field:"user",message:"No users Found"}]};
    }catch(e){
        return {errors:[{field:"google",message:e.message}]};
    }
}
export const googleUpdateSignature =async (refresh_token:string,user:any,html:string)=>{
    try {
        const client = await googleClient();
        client.setCredentials({
            refresh_token: refresh_token
        });
        const gmail = google.gmail('v1');
        google.options({auth: client});
        const response = await gmail.users.settings.sendAs.update({
            userId: 'me',
            sendAsEmail: user.email, //users.email
            fields: 'signature',
            resource: {
                signature: html
            }
         });
        return {status:"success"};
    }catch(e){
            return {errors:[{field:"google",message:e.message}]};
        }
}




