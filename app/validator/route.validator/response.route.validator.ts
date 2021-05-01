import {validate, ValidationError} from "class-validator";
export const errors =async (type:string,errorValue:[any]|ValidationError[])=>{
    const errors:any=[];
    if(type=="request"){
        await errorValue.forEach((error)=>{
            switch(error.property){
                case "email":{
                    errors.push({field:error.property,message:error.constraints!.isEmail})
                    break;
                }
                default :{
                    errors.push({field:error.property,message:"Error is in the field"})
                    break;
                }
            }
        })
    }else{
        await errorValue.forEach((error)=> {
            if (error == 11000) {
                errors.push({field: "email", message: "Duplicate email"});
            } else {
                errors.push({field: "database", message: "Database error"});
            }
        })
    }
    return{errors:errors};
}


export const responseValidator = async (options:any) =>{
    const validateResponse:ValidationError[] =await validate(options);
    if (validateResponse.length > 0) {
        const response:any=await errors("request",validateResponse);
        return response;
    } else {
      return null;
    }
}
