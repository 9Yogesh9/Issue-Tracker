const Project = require('../models/project');

module.exports.home = async (req, res) => {
    let projects = await Project.find({}).sort('name').exec();
    return res.render('home', {
        projects: projects
    });
}