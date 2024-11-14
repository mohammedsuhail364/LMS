const express = require("express");

const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error uploading file",
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const {id}=req.params;
    if(!id){
        return res.status(400).json({
            success:false,
            message:'Assest Id is required'
        })
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error deleting file",
    });
  }
});
