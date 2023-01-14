const Issues = require('../models/issues');
const Projects = require('../models/project');
const querystring = require('querystring');

module.exports.create = async (req, res) => {
    let bug_data = querystring.parse(req.body.new_bug);
    let bug_labels = req.body.labels;
    let bulk_labels = req.body.bulk_labels;

    try {
        let bug = await Issues.create({
            title: bug_data.name,
            description: bug_data.description,
            author: bug_data.author,
            labels: bug_labels,
            project: bug_data.project_id
        });

        let project = await Projects.findByIdAndUpdate(bug_data.project_id, { $push: { issue: bug }, labels: bulk_labels }).exec();
        project.save();

        if (req.xhr) {
            return res.status(200).json({
                bug_details: {
                    bug
                },
                message: "Bug Created !"
            });
        }
    } catch (error) {
        if (error) {
            console.log(`Error in creating the issue ${error}`);
            return res.status(501).send("Internal server error !");
        }
    }



    // Projects.findById(req.body.project_id, (err, project) => {
    //     if (err) {
    //         console.log(`Project not found while creating issue ${err}`);
    //         return;
    //     }

    //     Issues.create({
    //         title: req.body.name,
    //         description: req.body.description,
    //         author: req.body.author,
    //         labels: req.body.labels,
    //         project: req.body.project_id
    //     }, (err, new_issue) => {
    //         if (err) {
    //             console.log(`Internal server error in creating new issue ${err}`);
    //             return;
    //         }

    //         project.issue.push(new_issue);
    //         project.save();
    //         res.redirect('back');
    //     })
    // })
}

module.exports.delete = async (req, res) => {
    try {
        let bug = await Issues.findById(req.params.id, "project labels").exec();
        // Note the project ID for which the issue was created
        let project_id = bug.project;
        let project = await Projects.findById(project_id, "labels issue");
        let project_labels = JSON.parse(project.labels);

        for(labels of bug.labels){
            project_labels[labels] -= 1;
            if(!project_labels[labels])
                delete project_labels[labels];
        }

        bug.remove();

        await Projects.findByIdAndUpdate(project_id, { $pull: { issue: req.params.id }, labels: JSON.stringify(project_labels) }).exec();
        if (req.xhr) {
            return res.status(200).json({
                project_labels,
                issues : project.issue.length,
                message: "Issue Closed !"
            })
        }

    } catch (error) {
        if (error) {
            console.log(`Error in closing the issue ${error}`);
            return res.status(501).send("Internal server error !");
        }
    }
}