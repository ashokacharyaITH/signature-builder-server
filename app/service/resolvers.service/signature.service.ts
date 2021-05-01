import { DI } from "../../server";
import { PropertiesEntities, SignatureEntities, TemplateEntities, TokenType, UsersEntities } from "../../entities";
import { wrap } from "@mikro-orm/core";
import Handlebars from "handlebars";
import { googleUpdateSignature } from "../google.service";
import { emailSend } from "../email.service";
import { SignatureDraftEntities } from "../../entities/signatureDraft.entities";

export const SignatureListService=async (limit:any, offset:any)=>{
    const response:any = await DI.em.findAndCount(SignatureEntities, {},{populate:['draft','users'],limit:limit,offset:offset});
    return response;
}
export const SignatureAddService=async (option:any)=>{
    try{
        if(option.properties&&option.name&&option.template){
            const template:any = await DI.em.findOne(TemplateEntities, {id:option.template});
            const property=new PropertiesEntities(option.properties) //properties
            const signature = new SignatureEntities({name:option.name,campaign:option.campaign,account:option.account,template:template,properties:property});
            property.signature=signature;
            template.signatures.add(signature);
            //draft
            const propertyDraft=new PropertiesEntities(option.properties) //properties
            const draft = new SignatureDraftEntities({name:option.name,campaign:option.campaign,template:template,properties:propertyDraft});
            draft.signature=signature;
            template.signatures.add(draft);

            //put draft in signature
            signature.draft=draft;
            await DI.em.persistAndFlush(template)
            return {signature:signature};
        }else{
            return { errors:[{field:"signature",message:"Please supply all fields"}] };
        }

    }catch(e){
        return { errors:[{field:"signature",message:e.message}] };
    }
}
export const SignatureDraftService=async (option:any,signature:any)=>{
    try {
        const draft: any = await DI.em.findOne(SignatureDraftEntities, {id:signature.draft}, ['properties', 'template', 'signature']);
        if(draft){
            if (option.template) {
            if (draft.template.id !== option.template) {
                const template: any = await DI.em.findOne(TemplateEntities, {id: draft.template}, ['draft']); //old template remove signature
                template.drafts.remove(draft); //remove form old
                const newTemplate: any = await DI.em.findOne(TemplateEntities, {id: option.template}); //old template remove signature
                newTemplate.drafts.add(draft) //add in new template
                draft.template = template;
            }
        }
        if (option.campaign) {
            draft!.campaign = option.campaign;
        }
        if (option.properties) {
            wrap(draft.properties).assign(option.properties);
        }
        if (option.name) {
            draft.name = option.name;
        }
        await DI.em.persistAndFlush(draft);
        return {draft: draft};
        }
        return { errors:[{field:"draft",message:"no draft found"}] };
    }catch(e){
        return { errors:[{field:"draft",message:e.message}] };
    }
}
export const SignaturePublishService=async (option:any)=>{
    //publish will have one copy signature , one copy draft latest
    //hasDraft will have only draft copy, with hsDraft true.
    try{
        const signature:any = await DI.em.findOne(SignatureEntities, {id:option.signature},['properties','template','users','draft']);
        if(signature){
            const draftResponse=await SignatureDraftService(option,signature);
            if(option.hasDraft==false){
                if(option.template){
                    if(signature!.template.id!==option.template) {
                        const template:any = await DI.em.findOne(TemplateEntities, {id:signature.template},['signatures']); //old template remove signature
                        template.signatures.remove(signature); //remove form old
                        const newTemplate:any = await DI.em.findOne(TemplateEntities, {id:option.template}); //old template remove signature
                        newTemplate.signatures.add(signature) //add in new template
                        signature.template=newTemplate;
                        signature.draft.template=template;
                    }
                }
                if(option.campaign){
                    signature!.campaign=option.campaign;
                }
                if(option.properties){
                    wrap(signature!.properties).assign(option.properties)
                }
                if(option.name){
                    signature!.name=option.name;
                }
            }
            if(draftResponse.draft){
                signature!.draft=draftResponse.draft;
            }
            signature!.hasDraft=option.hasDraft;
            await DI.em.persistAndFlush(signature);
            if(option.hasDraft==false){ //if published
                await SignatureBroadcastAllService(signature.id) //broadcast signature
            }
            return {signature:signature};
        }

        return { errors:[{field:"signature",message:"No Signature found"}] };
    }catch(e){
        return { errors:[{field:"signature",message:e.message}] };
    }
}
export const SignatureAssignService=async (option:any)=>{
    try{

        const signature:any = await DI.em.findOne(SignatureEntities, {id:option.signature},['users','users.linkedPlatform','users.linkedPlatform.token','template','account','account.company','account.company.address','account.company.socials','account.company.socials.details','account.company.address']);
         if(!signature){
             return { errors:[{field:"signature",message:"No signature found"}] };
         }
         const matchUsers=[];
        for(let i=0;i<option.users.length;i++){
            const user =option.users[i];
            const foundUser:any = await DI.em.findOne(UsersEntities, {id:user.id},['signature','socials','socials.details']);
            if(foundUser){
                if(foundUser.signature){ //either assign to self or to other peoiple
                    if(foundUser.signature.id!=signature.id){ //is assign to other people
                        const signatureMatch:any = await DI.em.findOne(SignatureEntities, {id:foundUser.signature.id},['users']);//previous signature
                        if(signatureMatch){ //signature found
                            signatureMatch.users.remove(foundUser); // remove user from previous signature
                            await DI.em.persistAndFlush(signatureMatch);
                        }
                        foundUser.signature=signature;
                        foundUser.assigned=true;
                        signature.users.add(foundUser);
                        matchUsers.push(foundUser);
                    }
                }else{
                    foundUser.signature=signature;
                    foundUser.assigned=true;
                    signature.users.add(foundUser);
                    matchUsers.push(foundUser);
                }
            }
        }

        await DI.em.persistAndFlush(signature);

        await SignatureBroadcastService(signature,matchUsers); //generate signature
        if(matchUsers.length>0){
            return {signature:signature}; // true done some assigning
        }
        return { errors:[{field:"signature",message:"no users associated with supplied users id"}] };

    }catch(e){
        return { errors:[{field:"signature",message:e.message}] };
    }
}

export const SignatureDetachUsers=async(options:any)=>{
    //remove users from signature
    try {
            const signature: any = await DI.SignatureRepository.findOne({id: options.signatureId},['users']);
            if (signature) {
                if(options.users.length>0){
                    for (let i = 0; i < options.users; i++) {
                        const user:any=options.users[i];
                        const userRemove:any= await DI.orm.em.findOne(UsersEntities,{id:user.id},['signature']);
                        userRemove.assigned=false;
                        signature.remove(userRemove);
                    }
                }else{
                    signature.users.removeAll();
                }
                return { signature:signature };
            }
            return { errors:[{field:"signature",message:"No signature found"}] };

    }catch(e){
        return { errors:[{field:"signature",message:e.message}] };
    }
}
export const SignatureRemoveService=async (option:any)=>{
    try{
       const signature:any = await DI.SignatureRepository.findOne({id:option.signature});
       if(signature){
           const Draft = await DI.SignatureDraftRepository.findOne({id:signature.draft});
           if(Draft){
               await DI.SignatureDraftRepository.removeAndFlush(Draft); //remove draft
           }
           await DI.SignatureRepository.removeAndFlush(signature); //remove signature
       }
        const newUser:any= await DI.orm.em.findOne(UsersEntities,{signature:option.signature},['signature']);
        if(newUser){
            newUser!.signature=null; //make it undefined
            newUser.assigned=false;
            await DI.em.persistAndFlush(newUser);
        }

        return { signature:option.signature };
    }catch(e){
        return { errors:[{field:"signature",message:e.message}] };
    }
}
export const signatureEngine=(signature:any,user:any)=>{
    const account=signature.account;
    let socials=[];
    console.log(user.socials.length,"here")
    if(user.socials.length>0){
        socials =user.socials.forEach((social:any)=>{
            return {
                link:social.link,
                icon: {
                    src: social.details.icon_solid, //base on properties
                    alt: social.details.name,
                    backgroundColor: 'black'
                }
            }
        });
    }
    let address = {
        street:"123 some address",
        post_code:"1234",
        state:"State",
        country:"Country"
    }
    if(account.company){
        if(account.company.address){
             address =account.company.address.filter((address:any)=>address.isDefault==true)[0]; //default only for now, user can choose later
        }
    }

    let signatueOptions ={
        bio: {
            firstName: user.name.split(" ")[0],
            lastName: user.name.split(" ")[1],
            jobTitle: user.role?user.role:"Role",
            department: '',
            companyName: account.company?account.company.name:"Default Company",
            customField: '',
            avatar: {
                src: user.image?user.image:"https://f.hubspotusercontent30.net/hubfs/435035/default-avatar.png",
                alt: user.name
            },
            company: {
                image: {
                    src: account.company?account.company.image:"https://f.hubspotusercontent30.net/hubfs/435035/download.png",
                    alt: account.company?account.company.name:"ABC Company"
                },
                link: {
                    src: account.company?account.company.url:""
                }
            }
        },
        contact: {
            email: {
                icon: {
                    src: 'https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/email-icon-2x.png',
                    alt: 'Email'
                },
                link:user.email,
                display: user.email
            },
            website: {
                icon: {
                    src: 'https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/link-icon-2x.png',
                    alt: 'Website',
                },
                link: account.company?account.company.url:"",
                display: account.company?account.company.url:"Company Web Link"
            },
            address: {
                icon: {
                    src: 'https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/address-icon-2x.png',
                    alt: 'Address'
                },
                line1: address.street,
                line2: address.post_code,
                line3: address.state,
                line4: address.country,
                line5: ''
            },
            phone: {
                icon: {
                    src: 'https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/phone-icon-2x.png',
                    alt: 'Phone'
                },
                phoneOne:{
                    link: account.company?account.company.phone:"No Set",
                    display: account.company?account.company.phone:"No Set",
                },
                phoneTwo: {
                    link: '',
                    display: ''
                }
            },
        },
        socials: socials,
        display: {
            heading: signature.properties.heading,
            body: signature.properties.body,
            link: signature.properties.link,
            icons: signature.properties.icons,
            dividers: signature.properties.heading,
            sections: {
                bio: {
                    role: {
                        fontWeight: '600',
                    },
                }
            }
        },
    }
    const template  =  Handlebars.compile( signature.template.html );
    const html =template(signatueOptions);
    return html;

}

const broadcastSignature=async (user:any,signature:any)=>{
    const html =await signatureEngine(signature,user);
    let message=`Hi ${user.name} Your have new signature , copy from this link ans paste <a href="${process.env.PUBLIC_URL+'/signature-copy/'+user.id}">link</a></br></br>Here is the preview</br></br>${html}`;
    const subject="Signature updated";
    const from='"signatuer updated" <info@signaturebuilder.com.au>';
    if(user.linkedPlatform){
        const token:any =await DI.TokenRepository.findOne({linkedPlatform:user.linkedPlatform.id,tokenType:TokenType.gmail});
        if(token){
            googleUpdateSignature(token.token,user,html); //update the gmail mate
            message=`Hi ${user.name} Your gmail signature is updated , if not you can copy from this <a href="${process.env.PUBLIC_URL+'/signature-copy/'+user.id}">link</a></br></br>Here is the preview</br></br>${html}`;
        }
    }
    emailSend(
        user.email, from, subject, message
    );
}
export const SignatureBroadcastAllService=async (signatureId:any)=>{
    const signature:any = await DI.SignatureRepository.findOne({id:signatureId},['users','users.linkedPlatform','users.socials','users.socials.details','users.linkedPlatform.token','template','account','account.company','account.company.address','account.company.socials','account.company.socials.details','account.company.address']);
    console.log(signature.id,"i am here")
    await SignatureBroadcastService(signature,signature.users)
}
export const SignatureBroadcastService=async (signature:any,users:any)=>{
    //when assigning
    for(let i=0;i<users.length;i++){
      await broadcastSignature(users[i],signature)
    }
}
export const SignatureCopyService=async (option:any)=>{
    const signature:any = await DI.SignatureRepository.findOne({id:option.signature},['users','users.linkedPlatform','users.socials','users.socials.details','users.linkedPlatform.token','template','account','account.company','account.company.address','account.company.socials','account.company.socials.details','account.company.address']);
    if(signature){
        const user:any = await DI.em.findOne(UsersEntities, {id:option.user},['signature','socials','socials.details']);
        if(user&&signature.id===user.signature.id){
            const html=await signatureEngine(signature,user);
            return { html:html,user:user,signature:signature };
        }
        return { errors:[{field:"signature",message:"No User match found"}] };
    }
    return { errors:[{field:"signature",message:"No signature accociated with user"}] };
}