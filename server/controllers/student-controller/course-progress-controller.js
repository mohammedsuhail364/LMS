const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some eror Occured!",
    });
  }
};

// get current course progress
const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const studentPurchasedCourses = await StudentCourses.findOne({
      userId,
    });

    const isCurrentCoursePurchasedByCurrentUserOrNot =
      studentPurchasedCourses.courses.findIndex((item) => item.courseId) > -1;

    if(!isCurrentCoursePurchasedByCurrentUserOrNot){
        return res.status(200).json({
            success:false,
            isPurchase:false,
            message:'You need to purchase this course to access it'
        })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some eror Occured!",
    });
  }
};

// reset course progress

const resetCurrentCourseProgress = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some eror Occured!",
    });
  }
};

module.exports = {
  markCurrentLectureAsViewed,
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
};
