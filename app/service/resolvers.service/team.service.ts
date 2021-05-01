import { DI } from "../../server";
import { TeamEntities, TemplateEntities, UsersEntities } from "../../entities";
const cleanTeam=async(account:any)=>{
    let teams:any = await DI.em.find(TeamEntities, {account:account}, ['users']);
       for(let i=0;i<teams.length;i++){
                const team =teams[0];
                if(!team.users){
                    await DI.em.removeAndFlush(team)
                }
        }
}
export const TeamListService=async (limit:any, offset:any)=>{
    const response = await DI.em.findAndCount(TeamEntities, {},{limit:limit,offset:offset});
    return response;
}
export const teamCreate=async(teams:any,user:any,account:any)=>{
    await cleanTeam(account); //clean the empty user team;
    for(let i=0;i<teams.length;i++){
        const name=teams[i].name;
        const hub_id=teams[i].id;
        let team:any = await DI.em.findOne(TeamEntities, {hub_id: hub_id as string}, ['users']);

        if(team){ // account has team match
            team.name=name;
            team.users.add(user);
            user.teams.add(team);

        }else{
            const newTeam:any = new TeamEntities({
                name: name,
                hub_id:hub_id
            });
            newTeam.account =account;
            newTeam.users.add(user);
            user.teams.add(newTeam);
            await DI.em.persistAndFlush(newTeam);
        }
    }
}