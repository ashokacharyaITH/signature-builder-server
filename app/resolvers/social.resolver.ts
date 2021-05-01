import { Resolver, Arg, Query, Mutation, UseMiddleware, Ctx } from "type-graphql"

import {
    SocialItemInput,
    SocialItemListResponseTypes,
    SocialItemResponseTypes
} from "../types/graphes.types/social.graphs.types";
import { SocialServiceAddItem, SocialServiceListItem } from "../service/resolvers.service/social.service";

@Resolver()
export class SocialResolver {

    @Query(() => SocialItemListResponseTypes)
    async socialItemsList(): Promise<SocialItemListResponseTypes> {
        const reponse = await SocialServiceListItem();
        return reponse;
    }

    @Mutation(() => SocialItemResponseTypes )
    async socialItems(@Arg('options') options:SocialItemInput) {
            const reponse = await SocialServiceAddItem(options);
            return reponse;
    }
}
