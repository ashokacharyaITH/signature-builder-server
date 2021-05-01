import { createWriteStream, unlink } from "fs";

export const LocalStreamUpload=async(options:{stream:any,folder:string,filename:string,mimetype:string,encoding?:string})=>{
    const stream = options.stream();
    const id = 'xyz'; //should be random
    const path = `${options.folder}/${id}-${options.filename}`;
    const fileDetail = { id, filename:options.filename, mimetype:options.mimetype, path };
    await new Promise<{id:string,filename:string,mimetype:string,path:string}>((resolve, reject) => {
        const writeStream = createWriteStream(path);
        writeStream.on('finish', ()=>resolve(fileDetail));
        writeStream.on('error', (error) => {
            unlink(path, () => {
                reject(error);
            });
        });
        stream.on('error', (error:any) => writeStream.destroy(error));
        stream.pipe(writeStream);
    });
}