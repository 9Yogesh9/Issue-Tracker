const Issues = require('../models/issues');
const Projects = require('../models/project');

module.exports.do_search = async (req, res) => {

    try {
        let author = req.body.author;
        let title_desc = req.body.title_desc;
        let search_labels = req.body.search_labels;

        // console.log(req.body);
        // console.log(author, title_desc, search_labels);
        let bugs_list;
        if (author && title_desc && search_labels) {
            bugs_list = await Issues.find({
                $and: [
                    { project: req.params.id },
                    { $or: [{ "title": new RegExp(title_desc, 'i') }] },
                    { $or: [{ "author": new RegExp(author, 'i') }] },
                    { $or: [{ "description": new RegExp(title_desc, 'i') }] },
                    { $or: [{ labels: { $all: search_labels } }] },
                ]
            });
        }
        else if (author && title_desc) {
            bugs_list = await Issues.find({
                $and: [
                    { project: req.params.id },
                    { $or: [{ "author": new RegExp(author, 'i') }] },
                    { $or: [{ "title": new RegExp(title_desc, 'i') }] },
                    { $or: [{ "description": new RegExp(title_desc, 'i') }] }
                ]
            });
        } else if (title_desc) {
            bugs_list = await Issues.find({
                $and: [
                    { project: req.params.id },
                    { $or: [{ "title": new RegExp(title_desc, 'i') }] },
                    { $or: [{ "description": new RegExp(title_desc, 'i') }] }
                ]
            });
        } else if (author) {
            bugs_list = await Issues.find({ project: req.params.id, "author": new RegExp(author, 'i') });
        } else if (search_labels) {
            bugs_list = await Issues.find({ project: req.params.id, labels: { $all: search_labels } });
        } else {
            bugs_list = await Issues.find();
        }

        // console.log(bugs_list);

        if (req.xhr) {
            return res.status(200).json(bugs_list);
        }

        return res.send("done");
    } catch (error) {
        console.log(`Error in searching the document ${error}`);
        res.send("Internal server error !");
    }

}




// db.users.find(name: new RegExp(search)) //For substring search, case sensitive.
// db.users.find(name: new RegExp('^' + search + '$')) //For exact search, case sensitive
// db.users.find(name: new RegExp(search， ‘i')) //For substring search, case insensitive
// db.users.find(name: new RegExp('^' +search + '$', 'i')); //For exact search, case insensitive


// Test.find({
//     $and: [
//         { catID:21 },
//         { $or: [{ "attributes.attributeValueM" : 'wood|Frame Material' }, { "attributes.attributeValueM" : 'metal/Frame Material' }] },
//         { $or: [{ "attributes.attributeValueM" : 'blue|color' }, {"attributes.attributeValueM" : 'green|color'}] }
//     ]
// }).exec(function (err, results) {
//      // rest of code
// });