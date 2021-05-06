import { Resolver, Arg, Query, Mutation, UseMiddleware, Ctx } from "type-graphql"
import { createAccessToken, createRefreshToken, isTokenValid, setRefreshToken } from "../authorization";
import {
    OnBoardCompanyResponseTypes,
    OnBoardFormResponseTypes,
    OnBoardHubspotResponseTypes, OnBoardImportResponseTypes,
    OnBoardSubscriptionResponseTypes,
    ContextGraphsTypes,
    HubspotAuthTypes, onBoardImportInput,
    onBoardFormInput, onBoardCompanyInput, onBoardSubscriptionInput,
    onBoardHubspotInput, OnBoardProfileInput, OnBoardProfileResponseTypes
} from "../types";
import { hubspotCreateRefreshToken, hubspotProvideAuthUrl } from "../service/hubspot.service/hubspot.service";

import { FileUpload, GraphQLUpload } from "graphql-upload";
import { OnBoardProfileService, OnBoardSubscriptionService, S3StreamUpload } from "../service";
import {
    OnBoardCompanyService,
    OnBoardFormService,
    OnBoardHubspotService, OnBoardImportService,
    SubscriptionCreateService
} from "../service";

@Resolver()
export class OnBoardResolver {


    @Query(() => HubspotAuthTypes)
    async onBoardHubspotAuthUrl(): Promise<HubspotAuthTypes> {
        try{
            const link = await hubspotProvideAuthUrl();
            return {link:link}
        }catch(e){
            return {errors:[{field:"hubspot",message:e.message}]}
        }
    }
    @Mutation(() => OnBoardHubspotResponseTypes)
    async onBoardHubspot(@Arg('options') options:onBoardHubspotInput) {
        if(options.hubspot_code){
            const tokenResponse = await hubspotCreateRefreshToken(options.hubspot_code);
            if(!tokenResponse.errors){
                 return await OnBoardHubspotService(tokenResponse);
            }
            return {errors:tokenResponse.errors}
        }else{
            return {errors:[{field:"account",message:"No code provided"}]}
        }

    }
    @Mutation(() => OnBoardFormResponseTypes )
    async onBoardForm(@Arg('options') options:onBoardFormInput, @Ctx() {
        em,
        res,
        payload
    }: ContextGraphsTypes) {
        if(options.email&&options.name&&options.password&&options.terms_accepted){

                const accountResponse:any= await OnBoardFormService(options);
                if(!accountResponse.errors){
                    setRefreshToken(res, createRefreshToken(accountResponse.account));
                    console.log(accountResponse.account,"I am account")
                    return {
                        account: accountResponse.account,
                        accessToken: createAccessToken(accountResponse.account),
                    }
                }
             return {errors:accountResponse.errors}

        }else{
            return {errors:[{field:"account",message:"No options provided"}]}
        }

    }

    @Mutation(() => OnBoardCompanyResponseTypes )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async onBoardCompany(
        @Arg('image',()=>GraphQLUpload) image:FileUpload|null,
        @Arg('options') options:onBoardCompanyInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            let responsePromise:any={path:'',id:''}
            if(image){
                const {  createReadStream, filename, mimetype, encoding }:any = await image;
                responsePromise=await S3StreamUpload({stream:createReadStream,filename:filename,mimetype:mimetype})
            }
             const newOption={...options,image:responsePromise.path,account:payload!.account}
            const response = OnBoardCompanyService(newOption)
            return response;

        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }

    @Mutation(() => OnBoardProfileResponseTypes )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async onBoardProfile(
        @Arg('image',()=>GraphQLUpload) image:FileUpload|null,
        @Arg('options') options:OnBoardProfileInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            let responsePromise:any={path:'',id:''}
            if(image){
                const {  createReadStream, filename, mimetype, encoding }:any = await image;
                responsePromise=await S3StreamUpload({stream:createReadStream,filename:filename,mimetype:mimetype})
                if(responsePromise.errors){
                    return responsePromise;
                }
            }
            const newOption={...options,image:responsePromise.path,account:payload!.account}
            const response = OnBoardProfileService(newOption)
            return response;

        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }
    @Mutation(() => OnBoardSubscriptionResponseTypes )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async onBoardSubscription(
        @Arg('options') options:onBoardSubscriptionInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            const newOption = {...options,account:payload!.account}
            const subscription =OnBoardSubscriptionService(newOption);
            return subscription;

        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }

    @Mutation(() => OnBoardImportResponseTypes )
    @UseMiddleware(isTokenValid)
    async onBoardImport(
        @Arg('options') options:onBoardImportInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            const newOption = {...options,account:payload!.account}
            const users = OnBoardImportService(newOption);
            return users;

        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }

}
