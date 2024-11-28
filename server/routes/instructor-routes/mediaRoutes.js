const express = require("express");

const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();

// Configure storage and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Assest Id is required",
      });
    }
    await deleteMediaFromCloudinary(id);
    res.status(200).json({
      success: true,
      message: "Assest deleted successfully from cloudinary",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error deleting file",
    });
  }
});

router.post('/bulk-upload',upload.array('files',10),async(req,res)=>{
  try {
   const uploadPromises=req.files.map(fileItem=>uploadMediaToCloudinary(fileItem.path))
   
   const results=await Promise.all(uploadPromises);
  //  console.log(results);
   res.status(200).json({
    success:true,
    data:results,
   }) 
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in Bulking file",
    });
  }
})

module.exports = router;
