import { Resolver, Arg, UseMiddleware, Ctx, Mutation } from "type-graphql"

import {  isTokenValid } from "../authorization";
import {
    ContextGraphsTypes, onBoardSubscriptionInput, OnBoardSubscriptionResponseTypes,
} from "../types";

import { GoogleVerifyInput, GoogleVerifyResponseTypes } from "../types/graphes.types/google.graphs.types";
import { googleVerify } from "../service/google.service";

@Resolver()
export class GoogleResolver {

    @Mutation(() => GoogleVerifyResponseTypes )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async GoogleVerify(
        @Arg('options') options:GoogleVerifyInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            const newOption = {...options,account:payload!.account}
            const subscription =googleVerify(newOption);
            return subscription;

        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }

}
