import { Resolver, Arg, Query, Mutation, UseMiddleware, Ctx } from "type-graphql"
import ConnectionArgs from "../service/pagination.service/relay.pagination.service";
import { connectionFromArraySlice } from 'graphql-relay';

import AccountResponseTypes from "../service/pagination.service/AccountResponse.types";
import {
    ContextGraphsTypes,
    onBoardSubscriptionInput,
    OnBoardSubscriptionResponseTypes, SubscriptionPostInput,
    TemplateInput, TemplateResponse
} from "../types";
import { isTokenValid } from "../authorization";
import {
    SubscriptionCreateService,
    SubscriptionPostOnBoardService,
    TemplateAddService,
    TemplateListService
} from "../service";
import {TemplateListResponseTypes} from "../types/graphes.types/template.graphs.types";

@Resolver()
export class SubscriptionResolver {


    @Mutation(() =>  OnBoardSubscriptionResponseTypes )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async subscriptionPostCreate(
        @Arg('options') options:SubscriptionPostInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            const newOption = {...options,account:payload!.account}
            const subscriptionResponse =SubscriptionPostOnBoardService(newOption);
            return subscriptionResponse;
        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }

}
