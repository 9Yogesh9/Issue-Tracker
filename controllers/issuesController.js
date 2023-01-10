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
            if (err) {
                console.log(`Internal server error in creating new issue ${err}`);
                return;
            }

            project.issue.push(new_issue);
            project.save();
            res.redirect('back');
        })
    })
}

module.exports.delete = async (req, res) => {
    try {
        let bug = await Issues.findById(req.params.id, "id project").exec();;
        // Note the project ID for which the issue was created
        let project_id = bug.project;
        bug.remove();

        await Projects.findByIdAndUpdate(project_id, { $pull: { issue: req.params.id } }).exec();
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    bug
                },
                message: "Issue Closed !"
            })
        }

    } catch (error) {
        if (error) {
            console.log(`Error in closing the issue ${error}`);
            return res.send("Internal server error !");
        }
    }
}