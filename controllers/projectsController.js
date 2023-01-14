const Projects = require('../models/project');

module.exports.create = async (req, res) => {

    try {
        let project = await Projects.create({
            name: req.body.name.trim(),
            description: req.body.description.trim(),
            author: req.body.author.trim(),
            labels: {}
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
            return res.send("Internal server error !");
        }
    }
}

module.exports.details = async (req, res) => {
    try {
        let project = await Projects.findById(req.params.id)
            .populate({
                path: 'issue'
            });
        // res.locals.meera = `project${project.id}`;
        res.render('project_details', {
            project_details: project
        });
    } catch (error) {
        if (error) {
            console.log(`Error in sending the project details ${error}`);
            return res.send("Internal server error !");
        }
    }
}

module.exports.project_labels = async (req, res) => {
    let project = await Projects.findById(req.params.id).exec();

    try {
        if (req.xhr) {
            return res.status(200).json({
                project_labels: (project.labels[0]),
                message: "Project labels fetched successfully !"
            })
        }

    } catch (error) {
        if (error) {
            console.log(`Error in sending the project labels ${error}`);
            return res.send("Internal server error !");
        }
    }

}

module.exports.delete = async (req, res) => {

    try {
        let project = await Projects.deleteOne({ id: req.body.id });
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    project_id: project._id
                },
                message: "Project Deleted !"
            })
        }

    } catch (error) {
        if (error) {
            console.log(`Error in deleting the project ${error}`);
            return res.send("Internal server error !");
        }
    }

    // Projects.deleteOne({ id: req.body.id }, (err, project) => {
    //     if (err) {
    //         console.log(`Error in deleting project ${err}`);
    //         return;
    //     }
    //     // console.log(`Project Deleted ${project}`);
    //     res.redirect('back');
    // })
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