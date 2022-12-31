const Project = require('../models/project');

module.exports.home = (req, res) => {

    Project.find({}, (err, projects) => {
        if (err) {
            console.log(`Error in sending project to homepage`);
            return;
        }

        return res.render('home', {
            projects: projects
        });
    })

}