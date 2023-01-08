const Issues = require('../models/issues');
const Projects = require('../models/project');

module.exports.create = (req, res) => {
    Projects.findById(req.body.project_id, (err, project) => {
        if (err) {
            console.log(`Project not found while creating issue ${err}`);
            return;
        }

        Issues.create({
            title: req.body.name,
            description: req.body.description,
            author: req.body.author,
            labels: req.body.labels,
            project: req.body.project_id
        }, (err, new_issue) => {
            if(err){
                console.log(`Internal server error in creating new issue ${err}`);
                return;
            }

            project.issue.push(new_issue);
            project.save();
            res.redirect('back');
        })
    })
}