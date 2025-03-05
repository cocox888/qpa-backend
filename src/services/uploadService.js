const Upload = require("../../models/Upload");

class UploadService {
  async createUpload(data) {
    try{
      const upload=await Upload.create(data);
      return upload;
    }catch(e){
      throw new Error(e);
    }
  }

  async getAllUploads(){
    try{
      const uploads=await Upload.findAll(
        
      );
      return uploads;
    }catch(e){
      throw new Error(e);
    }
  }
}

module.exports = new UploadService();
