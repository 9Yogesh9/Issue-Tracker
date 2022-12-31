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
        return res.redirect('back');
    })

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

module.exports.deleteAll = (req,res) => {
    Projects.deleteMany({},(err, project)=>{
        if (err) {
            console.log(`Error in deleting project ${err}`);
            return;
        }
        // console.log(`Project Deleted ${project}`);
        res.send('Data Cleared !');
    })
}