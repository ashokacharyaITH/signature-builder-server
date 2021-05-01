import { Resolver, Arg, Query, UseMiddleware, Ctx } from "type-graphql"

import {  isTokenValid } from "../authorization";
import {
    ContextGraphsTypes,
    HubspotAuthTypes, hubspotListInput, HubspotListTypes,
} from "../types";
import {
    hubspotListUser,
    hubspotProvideAuthUrl
} from "../service/hubspot.service/hubspot.service";

@Resolver()
export class HubspotResolver {

    @Query(() => HubspotAuthTypes)
    async hubspotAuthUrl(): Promise<HubspotAuthTypes> {
        try{
            const link = await hubspotProvideAuthUrl();
            return {link:link}
        }catch(e){
            return {errors:[{field:"hubspot",message:e.message}]}
        }
    }
    @Query(() => HubspotListTypes)
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async hubspotUserList(@Arg('options') options:hubspotListInput,@Ctx() {em, res, payload}: ContextGraphsTypes) {
            console.log(payload,"payload")
            if(payload!.status=="success") {
                const limit = options.limit ? options.limit : 20;
                const response = await hubspotListUser(payload!.account, limit, options.cursor);
                return response;
            }else{
                return {errors:[{field:"account",message:"Invalid Account"}]}
            }

    }

}
