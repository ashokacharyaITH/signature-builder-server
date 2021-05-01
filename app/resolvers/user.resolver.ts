import { Resolver, Arg, Query, Mutation, UseMiddleware, Ctx } from "type-graphql"
import ConnectionArgs from "../service/pagination.service/relay.pagination.service";
import { connectionFromArraySlice } from 'graphql-relay';

import {
    ContextGraphsTypes, onBoardCompanyInput, OnBoardCompanyResponseTypes
} from "../types";
import { isTokenValid } from "../authorization";
import {
    OnBoardCompanyService,
    S3StreamUpload,
    UserRemoveService,
    UsersDetachSignature, UserSearch, UserUpdateService, UserVerifyPasscode,
} from "../service";

import {
    UserDetachInput,
    UserDetachResponse, UserResponse,
    UserSearchInput,
    UserSearchResponseTypes, UserUpdateInput
} from "../types/graphes.types/user.graphs.types";
import { SignatureDetachInput, SignatureResponse } from "../types/graphes.types/signature.graphs.types";
import { FileUpload, GraphQLUpload } from "graphql-upload";

@Resolver()
export class UserResolver {

    @Query(() => UserSearchResponseTypes)
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async userSearchList(@Arg("option") options: UserSearchInput, @Arg("arg") arg: ConnectionArgs, @Ctx() {em, res, payload}: ContextGraphsTypes): Promise<UserSearchResponseTypes> {
        if(payload!.status=="success"){
        const { limit, offset } = arg.pagingParams();

        const response:any = await UserSearch({account:payload!.account,keyword:options.keyword,offset:offset,limit:limit,sort:options.sort,orderBy:options.orderBy,teams:options.teams})

            if(response.errors){
                return response;
            }
             const data=response.users
            const total=response.total
        const page = connectionFromArraySlice(
            data, arg, { arrayLength: total, sliceStart: offset || 0 },
        )
        return { page, pageData: { count:0, limit, offset } }
        }else{
            return {page:null,errors:[{field:"account",message:"Invalid Account"}]}
        }
    }
    @Mutation(() => UserDetachResponse )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async userDetachSignature(
        @Arg('options') options:UserDetachInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            const newOption = {...options,account:payload!.account}
            const userResponse =await UsersDetachSignature(newOption);
            return userResponse;

        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }

    @Mutation(() => UserDetachResponse )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async userRemove(
        @Arg('options') options:UserDetachInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            const newOption = {...options,account:payload!.account}
            const userResponse =await UserRemoveService(newOption);
            return userResponse;
        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }
    @Mutation(() => UserResponse )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async UserUpdateService(
        @Arg('image',()=>GraphQLUpload) image:FileUpload|null,
        @Arg('options') options:UserUpdateInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            //is valid token
           const newOption={...options,account:payload!.account}
            const response = UserUpdateService(newOption,image);
            return response;

        }else{
            // has no token valid
            if(options.accountId&&options.passcode&&options.userId){ //suplied these things
                const response = UserUpdateService(options,image);
                return response;
            }

            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }
}
