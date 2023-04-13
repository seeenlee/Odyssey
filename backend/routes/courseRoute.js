const router = require('express').Router();
let Course = require('../models/Course');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { RestartProcess } = require('concurrently');

// Get all courses --------------------------------
router.route("/").get((req, res) => {
    Course.find()
    .then(courses => res.json(courses))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route('/add').post((req, res) => {
    const name = req.body.name;

    const newCourse = new Course({
        "name": name
    });

    newCourse.save()
        .then(() => res.status(201).json("Course added!"))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route('/clear').post(async (req, res) => {
    const status = await Course.deleteMany({});
    res.status(200).json({message: 'cleared'})
})

router.route('/fixformat').post(async (req, res) => {
    const status = await Course.updateMany(
        {
            $set: {
                reviews: [],
                users: [],
            }   
        }
    );
    res.status(200).json({message: 'fixed'})
})

router.route('/addscore').post(async (req, res) => {
    const status = await Course.updateMany(
        {
            $set: {
                totalscore: 0
            }   
        }
    );
    res.status(200).json({message: 'added'})
})

module.exports = router;