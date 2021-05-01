import {DI} from "../../server";
import { TemplateEntities } from "../../entities";

export const TemplateListService=async (limit:any, offset:any)=>{
     const response = await DI.em.findAndCount(TemplateEntities, {},{limit:limit,offset:offset});
    return response;
}
export const TemplateAddService=async (option:any)=>{
    try{
        const template = new TemplateEntities({html:option.html,name:option.name,isDefault:option.isDefault});
        await DI.em.persistAndFlush(template)
        return {template:template};
    }catch(e){
        return { errors:[{field:"template",message:e.message}] };
    }

}