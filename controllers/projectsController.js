const Projects = require('../models/project');

module.exports.create = (req, res) => {
    Projects.create({
        name: req.body.name.trim(),
        description: req.body.description.trim(),
        author: req.body.author.trim()
    }, (err, project) => {
        if (err) {
            console.log(`Error in creating project ${err}`);
            return;
        }
        return res.render('home');
    })

}