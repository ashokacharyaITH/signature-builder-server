import { Resolver, Arg, Query, Mutation, UseMiddleware, Ctx } from "type-graphql"
import ConnectionArgs from "../service/pagination.service/relay.pagination.service";
import { connectionFromArraySlice } from 'graphql-relay';

import {
    ContextGraphsTypes
} from "../types";
import { isTokenValid } from "../authorization";
import {
    SignatureAddService, SignatureAssignService, SignatureCopyService, SignatureDetachUsers,
    SignatureListService, SignaturePublishService, SignatureRemoveService
} from "../service";
import {
    SignatureInput,
    SignatureResponse,
    SignatureListResponseTypes,
    SignatureDeleteInput,
    SignatureDeleteResponse,
    SignatureAssignInput, SignaturePublishInput, SignatureCopyInput, SignatureCopyResponseTypes, SignatureDetachInput
} from "../types/graphes.types/signature.graphs.types";

@Resolver()
export class SignatureResolver {

    @Query(() => SignatureListResponseTypes)
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async signatureList(@Arg("arg") arg: ConnectionArgs, @Ctx() {em, res, payload}: ContextGraphsTypes): Promise<SignatureListResponseTypes> {
        if(payload!.status=="success"){
        const { limit, offset } = arg.pagingParams()
        const [accounts, count] = await SignatureListService(limit, offset)
        const page = connectionFromArraySlice(
            accounts, arg, { arrayLength: count, sliceStart: offset || 0 },
        )
        return { page, pageData: { count, limit, offset } }
        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }
    @Query(() => SignatureCopyResponseTypes)
    async signatureCopyHtml(@Arg('options') options:SignatureCopyInput): Promise<SignatureCopyResponseTypes> {
        const signatureResponse =await SignatureCopyService(options);
        return signatureResponse;
    }
    @Mutation(() => SignatureResponse )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async signatureAdd(
        @Arg('options') options:SignatureInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            const newOption = {...options,account:payload!.account}
            const signatureResponse =SignatureAddService(newOption);
            return signatureResponse;

        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }
    @Mutation(() => SignatureResponse )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async signatureDetachUsers(
        @Arg('options') options:SignatureDetachInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            const newOption = {...options,account:payload!.account}
            const signatureResponse =await SignatureDetachUsers(newOption);
            return signatureResponse;

        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }
    @Mutation(() => SignatureResponse )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async signaturePublish(
        @Arg('options') options:SignaturePublishInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            const newOption = {...options,account:payload!.account}
            const signatureResponse =SignaturePublishService(newOption);
            return signatureResponse;

        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }
    @Mutation(() => SignatureDeleteResponse )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async signatureRemove(
        @Arg('options') options:SignatureDeleteInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            const newOption = {...options,account:payload!.account}
            const signatureResponse =SignatureRemoveService(newOption);
            return signatureResponse;

        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }
    @Mutation(() => SignatureResponse )
    @UseMiddleware(isTokenValid)//update in context eh.payload
    async signatureAssign(
        @Arg('options') options:SignatureAssignInput, @Ctx() {em, res, payload}: ContextGraphsTypes) {
        if(payload!.status=="success"){
            const newOption = {...options,account:payload!.account}
            const signatureResponse =SignatureAssignService(newOption);
            return signatureResponse;

        }else{
            return {errors:[{field:"account",message:"Invalid Account"}]}
        }
    }

}
