const Projects = require('../models/project');

module.exports.create = async (req, res) => {

    try {
        let project = await Projects.create({
            name: req.body.name.trim(),
            description: req.body.description.trim(),
            author: req.body.author.trim()
        });
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    project
                },
                message: "Project Created !"
            })
        }
    } catch (error) {
        if (error) {
            console.log(`Error in creating the project ${error}`);
            return;
        }
    }
}

module.exports.delete = (req, res) => {

    Projects.deleteOne({ id: req.body.id }, (err, project) => {
        if (err) {
            console.log(`Error in deleting project ${err}`);
            return;
        }
        // console.log(`Project Deleted ${project}`);
        res.redirect('back');
    })
}

module.exports.deleteAll = (req, res) => {
    Projects.deleteMany({}, (err, project) => {
        if (err) {
            console.log(`Error in deleting project ${err}`);
            return;
        }
        // console.log(`Project Deleted ${project}`);
        res.send('Data Cleared !');
    })
}