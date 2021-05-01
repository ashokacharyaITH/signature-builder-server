import AWS from "aws-sdk";
import { createWriteStream, unlink } from "fs";
import { S3UploadConfig, S3UploadStream } from "../../types";
import * as stream from "stream";

export let S3Service:any=null

export const initializeS3=(config:S3UploadConfig)=>{
    AWS.config = new AWS.Config();
    AWS.config.update({
        region: config.region || "ca-central-1",
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    });
    S3Service = {s3:new AWS.S3(),config:config};
}

export const createUploadStream=(key: string): S3UploadStream => {
    const pass = new stream.PassThrough();
    return {
        writeStream: pass,
        promise: S3Service.s3
            .upload({
                Bucket:S3Service.config.destinationBucketName,
                Key: key,
                Body: pass
            })
            .promise()
    };
}
export const createDestinationFilePath=(fileName: string, mimetype: string, encoding: string) => {
    return fileName;
}
export const S3StreamUpload=async(options:{stream:any,filename:string,mimetype:string,encoding?:string})=>{
if(S3Service){
    const stream = options.stream();
    const filePath =createDestinationFilePath(options.filename,options.mimetype,options.encoding!);
    const uploadStream = createUploadStream(filePath);
    stream.pipe(uploadStream.writeStream);
    const result = await uploadStream.promise;
    return {  id:result.Key,path:result.Location }
}


}