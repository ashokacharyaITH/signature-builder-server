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
import { TeamListService } from "../service/resolvers.service/team.service";
import { TeamListResponseTypes } from "../types/graphes.types/team.graphs.types";

@Resolver()
export class TeamResolver {

    @Query(() => TeamListResponseTypes)
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async teamList(@Arg("arg") arg: ConnectionArgs, @Ctx() {em, res, payload}: ContextGraphsTypes): Promise<TeamListResponseTypes> {
        if(payload!.status=="success"){
        const { limit, offset } = arg.pagingParams()
        const [teams, count] = await TeamListService(limit, offset)
        const page = connectionFromArraySlice(
            teams, arg, { arrayLength: count, sliceStart: offset || 0 },
        )
        return { page, pageData: { count, limit, offset } }
        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }


}
