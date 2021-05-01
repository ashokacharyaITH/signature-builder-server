import {Connection, EntityManager, IDatabaseDriver} from "@mikro-orm/core";
import {Request,Response} from "express"
import {AccountEntities} from "../../entities";

export interface ContextGraphsTypes {
    req:Request,
    res:Response,
    em:EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
    payload?:{account:AccountEntities,accessToken?:any,errors?:any,validateArgument?:any,status?:any}
}
