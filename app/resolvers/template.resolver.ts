import { Resolver, Arg, Query, Mutation, UseMiddleware, Ctx } from "type-graphql"
import ConnectionArgs from "../service/pagination.service/relay.pagination.service";
import { connectionFromArraySlice } from 'graphql-relay';

import AccountResponseTypes from "../service/pagination.service/AccountResponse.types";
import {
    ContextGraphsTypes,
    onBoardSubscriptionInput,
    OnBoardSubscriptionResponseTypes,
    TemplateInput, TemplateResponse
} from "../types";
import { isTokenValid } from "../authorization";
import { SubscriptionCreateService, TemplateAddService, TemplateListService } from "../service";
import {TemplateListResponseTypes} from "../types/graphes.types/template.graphs.types";

@Resolver()
export class TemplateResolver {

    @Query(() => TemplateListResponseTypes)
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async templateList(@Arg("arg") arg: ConnectionArgs, @Ctx() {em, res, payload}: ContextGraphsTypes): Promise<TemplateListResponseTypes> {
        if(payload!.status=="success"){
        const { limit, offset } = arg.pagingParams()
        const [accounts, count] = await TemplateListService(limit, offset)
        const page = connectionFromArraySlice(
            accounts, arg, { arrayLength: count, sliceStart: offset || 0 },
        )
        return { page, pageData: { count, limit, offset } }
        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }
    @Mutation(() => TemplateResponse )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async templateAdd(
        @Arg('options') options:TemplateInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            const newOption = {...options,account:payload!.account}
            const templateResponse =TemplateAddService(newOption);
            return templateResponse;

        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }

}
