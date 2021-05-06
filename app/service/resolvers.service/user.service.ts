import {DI} from "../../server";
import {
    AccountEntities,
    OwnerSocialType,
    SignatureEntities,
    SocialsEntities,
    UsersEntities
} from "../../entities";
import { emailSend } from "../email.service";
import { googleGenerateAuthLink } from "../google.service";
import { teamCreate } from "./team.service";
import { ObjectId } from '@mikro-orm/mongodb';
import { S3StreamUpload } from "../stream.upload";
export const UserCreate= async(user:any,account:any) => {
    try{
        const newUser:any = new UsersEntities({
            name: user.name,
            email: user.email,
            hub_id: user.hub_id,
            account: account
        });
        await teamCreate(user.teams,newUser,account);
        account!.users!.add(newUser);
        const state=account!.id+"|"+user.email;
        const authGoogleLink = await googleGenerateAuthLink(state);
        const updateProfileLink = process.env.PUBLIC_URL + "/update-profile/" + account!.id + "/" + user!.email;
        emailSend(
            user.email, '"Complete your user profile of signature builder" <info@signaturebuilder.com.au>', "Complete your signature builder profile", `Hi ${user.name} Authorize <a href="${authGoogleLink.url}">Gmail</a> for updating signature, and complete <a href="${updateProfileLink}">profile</a>`
        );
        return {user:user,account:account};
    }catch(e){
        return { errors:[{field:"user",message:"User cannot be created"}] };
    }

}
export const UserAdd= async(option:any,user:any,account:any) => {
    try{
        user.account=account;
        user.name=option.name;
        user.team=option.team;
        user.hub_id=option.hub_id;
        await teamCreate(user.teams,user,account); //create team
        account!.users!.add(user);
        const state=account!.id+"|"+user.email;
        const updateProfileLink = process.env.PUBLIC_URL + "/update-profile/" + account!.id + "/" + user!.email;
        if(!option.linked_google){
            const authGoogleLink = await googleGenerateAuthLink(state);
            emailSend(
                user.email, '"Complete your user profile of signature builder" <info@signaturebuilder.com.au>', "Complete your signature builder profile", `Hi ${user.name} Authorize <a href="${authGoogleLink.url}">Gmail</a> for updating signature, and complete <a href="${updateProfileLink}">profile</a>`
            );
        }else{
            emailSend(
                user.email, '"Complete your user profile of signature builder" <info@signaturebuilder.com.au>', "Complete your signature builder profile", `Hi ${user.name}  complete your <a href="${updateProfileLink}">profile</a>`
            );
        }

        return {user:user,account:account};
    }catch(e){
        return { errors:[{field:"user",message:"User cannot be created"}] };
    }

}
const createTeamMatch=(teams:any)=>{
    const array:any=[];
    teams.forEach((team:any)=>{
        array.push({ $elemMatch: { $eq: new ObjectId(team.id)}})
    })

    return array;
}
const createUserMatch=(account:any,keyword:string,teams:any)=>{
    let match=null;
    const teamSearch =createTeamMatch(teams)
    if(keyword=="any"){
    if(teamSearch.length>0){
        match={account:account._id,teams:{ $all:teamSearch }};
    }else{
        match={account:account._id};
    }

    }else{
        if(teamSearch.length>0) {
            match = {account: account._id, $text: {$search: keyword}, teams: {$all: teamSearch}};
        }else{
            match = {account: account._id, $text: {$search: keyword}};
        }
    }
    return match;
}

const createUserSort=(sort:string,orderBy:string)=>{
    const sortBy=sort==="desc"?-1:1;
    switch(orderBy){
        case "name":{
            return { name:sortBy }
            break;
        }
        case "role":{
            return { role:sortBy }
            break;
        }
        case "email":{
            return { email:sortBy }
            break;
        }
        case "mobile":{
            return { mobile:sortBy }
            break;
        }
        case "signature":{
            return { 'signature.name':sortBy }
            break;
        }
        case "team":{
            return { 'signature.name':sortBy }
            break;
        }
        case "status":{
            return { 'linkedPlatform.linked':sortBy }
            break;
        }
        default:{
            return { createdAt:sortBy }
            break;
        }
    }
}
const createUserProject=(keyword:string)=>{
    if(keyword!="any"){
        return {
            id:1,
            email:1,
            score: { $meta: "textScore" },

        }
    }else{
        return {
            id:1,
            email:1,
        }
    }
}
export const searchUserFn = async (account:any,keyword:string,offset:number,limit:number,sort:string,orderBy:string,teams:any)=>{
    return await DI.orm.em.getDriver().aggregate('UsersEntities',[
        { $match: createUserMatch(account,keyword,teams)},
        { $sort: createUserSort(sort,orderBy)},
        { $project: createUserProject(keyword) },
        { $group: {
                _id: null,
                // get a count of every result that matches until now
                total: { $sum: 1 },
                // keep our results for the next operation
                results: { $push: '$$ROOT' }
            } },
        { $project: {
                total: 1,
                rows: { $slice: ['$results', offset, limit] }
            } }
    ])
}
export const normalizeUser=async (users:any,account:any)=>{
    var newUsers=[];
    for(let i=0;i<users.length;i++){
        const user =users[i];
        const newUser= await DI.orm.em.findOne(UsersEntities,{account:account,email:user.email},['linkedPlatform','socials','socials.details','signature','teams']);
        if(newUser){
            newUsers.push(newUser)
        }

    }
    return newUsers;
}
export const UserSearch= async(option:any) => {
    try{
        const result = await searchUserFn(option.account,option.keyword,option.offset,option.limit,option.sort,option.orderBy,option.teams);
        let data:any=[]
        if(result[0]){
            data =await normalizeUser(result[0].rows,option.account);
        }
        return {users:data,total:result[0]?result[0].total:0};
    }catch(e){
        return { errors:[{field:"user",message:e.message}] };
    }

}
export const UsersDetachSignature=async(option:any)=>{
    //detach the signature from the user list
    try{
        if(option.users.length>0){
            const Users=[];
            for(let i=0;i<option.users.length;i++){
                const user =option.users[i];
                const newUser:any= await DI.orm.em.findOne(UsersEntities,{id:user.id},['signature','signature.users']);
                const newSignature =newUser.signature;
                newSignature.users.remove(newUser);
                newUser.assigned=false;
                await DI.em.persistAndFlush(newUser)
                Users.push(newUser)
            }
            return {users:Users};
        }
        return { errors:[{field:"user",message:"No User Supplied"}] };

    }catch(e){
        return { errors:[{field:"user",message:e.message}] };
    }
}
export const UserRemoveService=async(option:any)=>{
    //detach the user from account , and make it reusable.

    try{
        const account:any= await DI.orm.em.findOne(AccountEntities,{id:option.account.id},['users']);

        if(option.users.length>0){
            const Users=[];
            for(let i=0;i<option.users.length;i++){
                const user =option.users[i];
                const newUser:any= await DI.orm.em.findOne(UsersEntities,{id:user.id,account:account},['signature']);
                if(newUser){
                    account.users.remove(newUser) //user remove from account, but stays in database
                    const signature:any= await DI.orm.em.findOne(SignatureEntities,{id:newUser.signature.id},['users']); //find instance
                    signature.users.remove(newUser); //remove from signatures
                    newUser.assigned=false;
                    newUser.teams.removeAll();
                    await DI.em.persistAndFlush([account,newUser])
                    Users.push(newUser)
                }

            }
            if(Users.length>0){
                return {users:Users};
            }
            return { errors:[{field:"user",message:"No User Found"}] };
        }
        return { errors:[{field:"user",message:"No User Supplied"}] };

    }catch(e){
        return { errors:[{field:"user",message:e.message}] };
    }
}
export const UserVerifyPasscode=async(passcode:string,accountId:string,userId:string)=> {
    if(passcode&&accountId&&userId){
        const account:any= await DI.orm.em.findOne(AccountEntities,{id:accountId});
        if(account){
            const newUser:any= await DI.orm.em.findOne(UsersEntities,{account:account,passcode:passcode,id:userId},['account']);
            if(newUser){
                return {account:account}
            }
            return { errors:[{field:"user",message:"No User Matches to the passcode"}] };
        }
        return { errors:[{field:"user",message:"No Account Exit"}] };
    }
    return { errors:[{field:"user",message:"Supply all fields"}] };
}
export const UserUpdateService=async(option:any,image:any)=>{
    try {
    let account=option.account;  //either of them
    if(!option.account){ //not coming from token
        const response:any =await UserVerifyPasscode(option.passcode,option.accountId,option.userId);
        if(response.errors){
            return  response;
        }
        account=option.accountId
    }

    let responsePromise:any={path:'',id:''}
    if(image){
        const {  createReadStream, filename, mimetype, encoding }:any = await image;
        responsePromise=await S3StreamUpload({stream:createReadStream,filename:filename,mimetype:mimetype})
    }
    const imagePath=responsePromise.path //image
    const user:any = await DI.em.findOne(UsersEntities, {id: option.userId as string},['socials']);
    if(user){
        user.socials.removeAll(); // clean it and
          for(let i=0;i<option.socials.length;i++){
            const optionSocials=option.socials[i];
            const socials=new SocialsEntities({link:optionSocials.link,details:optionSocials.id,user:user,ownerType:OwnerSocialType.user});
            user!.socials!.add(socials);
        }
        user.image=imagePath;
        user.name=option.name;
        user.role=option.role;
        user.phone=option.phone;
        user.mobile=option.mobile;
        await DI.em.persistAndFlush(user as any);
        return {user:user}
    }
    return { errors:[{field:"user",message:"No user found"}] };
    }catch (e) {
        return { errors:[{field:"user",message:e.message}] };
    }


}