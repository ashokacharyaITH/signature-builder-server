import {MiddlewareFn} from "type-graphql/dist/interfaces/Middleware";
import {authorizeJWT, authorizeLocal} from "../../service";
import { DI } from "../../server";
import { AccountEntities } from "../../entities";


export const isTokenValid:MiddlewareFn<any> = async ({context}, next) => {
    await authorizeJWT(context, next).then((data) => {
        context.payload = data;
        return next();
    });
}
export const isAccountValid:MiddlewareFn<any> = async ({context,args}, next) => {
    await authorizeLocal(context,args).then((data) => {
        context.payload = data;
        return next();
    });
}

    // const authorisation = context.req.headers['authorization'];
    // if(!authorisation) {
    //     throw new Error("not authenticated");
    // }
    // try {
    //     const token = authorisation?.split(" ")[1];
    //     const payload = verify(token,process.env.ACCESS_TOKEN_SECRET!);
    //     context.payload=payload as any;
    // } catch(err) {
    //            throw new Error("not Authenticated");
    // }
    // return next();


