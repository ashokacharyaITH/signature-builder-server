import { DI } from "../../server";
import {
    AccountEntities,
    SocialDetailsEntities,
} from "../../entities";

export const SocialServiceAddItem = async(option:any) => {
    try {
        if(option.name&&option.icon_round&&option.icon_solid&&option.icon_square&&option.priority){
            console.log(option,"i am option")
            const socialDetails =new SocialDetailsEntities({name:option.name,icon_round:option.icon_round,icon_solid:option.icon_solid,icon_square:option.icon_square,priority:option.priority});
            await DI.em.persistAndFlush(socialDetails);
            return {socialItem:socialDetails}
        }
        return { errors:[{field:"social",message:"No Details provided for social Items"}] };
    } catch (err) {
        return { errors:[{field:"social",message:err.message}] };
    }
}
export const SocialServiceListItem = async() => {
    try {
        const socialItem = await DI.SocialDetailsRepository.findAll();
        return {socialItem:socialItem}
    } catch (err) {
        return { errors:[{field:"social",message:err.message}] };
    }
}