import { Resolver, Arg, Query, Mutation, UseMiddleware, Ctx, Int } from "type-graphql"
import {
    clearRefreshToken,
    createAccessToken,
    createRefreshToken,
    isAccountValid,
    isTokenValid,
    setRefreshToken
} from "../authorization";
import { ContextGraphsTypes } from "../types";
import {
    AccountChangePassword,
    AccountForgotPassword,
    accountInfo
} from "../service/resolvers.service/account.service";
import {
    AccountLoginInput,
    AccountPasswordChangeInput,
    AccountResponse
} from "../types/graphes.types/accounts.graphs.types";
import { AccountEntities } from "../entities";

@Resolver()
export class AccountResolver {
    @Query(() => AccountResponse, {nullable: true})
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async me(@Ctx() {payload}: ContextGraphsTypes) {
        if (payload!.status == "success") {
            return accountInfo(payload!.account);
        } else {
            return {errors: [{field: "accessToken", message: "Invalid Access Token"}]}
        }
    }


    @Mutation(() => AccountResponse)
    async AccountChangePassword(
        @Arg('options') options: AccountPasswordChangeInput,
        @Ctx() {req}: ContextGraphsTypes
    ): Promise<AccountResponse> {
        const response: any = await AccountChangePassword(options);
        return response;
    }


    @Mutation(() => AccountResponse)
    async AccountForgotPassword(
        @Arg("email") email: string,
    ): Promise<AccountResponse> {
        const response: any = await AccountForgotPassword(email);
        return response;

    }

    @Mutation(() => Boolean)
    async AccountLogout(@Ctx() {res}: ContextGraphsTypes) {
        clearRefreshToken(res);
        return true;
    }

    @Mutation(() => Boolean)
    async revokeRefreshTokensForAccount(@Arg('accountId', () => Int) userId: number, @Ctx() {em}: ContextGraphsTypes) {
        const account = await em.findOne(AccountEntities, {}, {filters: {id: {id: userId}}});
        if (!account) {
            return false;
        }
        const version = account.refresh_token_version!; //change the token version,
        account.refresh_token_version = version + 1;
        await em.persistAndFlush(account);
        return true;
    }

    @Mutation(() => AccountResponse)
    @UseMiddleware(isAccountValid)//update in context eh.payload
    async AccountLogin(@Arg('options') options: AccountLoginInput, @Ctx() {
        res,
        em,
        payload
    }: ContextGraphsTypes): Promise<AccountResponse> {
        if (payload!.account) {
            setRefreshToken(res, createRefreshToken(payload!.account));
            const response:any = await accountInfo(payload!.account);
            return response;
        } else {
            return {errors: payload!.errors, accessToken: null};
        }
    }
}
