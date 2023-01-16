const Issues = require('../models/issues');

// Handles the search functionality on project details page
module.exports.do_search = async (req, res) => {

    try {
        let author = req.body.author;
        let title = req.body.title;
        let description = req.body.description;
        let search_labels = req.body.search_labels;

        let bugs_list;
        if (author && title && description && search_labels) {
            bugs_list = await Issues.find({
                $and: [
                    { project: req.params.id },
                    { $or: [{ "title": new RegExp(title, 'i') }] },
                    { $or: [{ "author": new RegExp(author, 'i') }] },
                    { $or: [{ "description": new RegExp(description, 'i') }] },
                    { $or: [{ labels: { $in: search_labels } }] },
                ]
            });
        }
        else if (author && title && description) {
            bugs_list = await Issues.find({
                $and: [
                    { project: req.params.id },
                    { $or: [{ "author": new RegExp(author, 'i') }] },
                    { $or: [{ "title": new RegExp(title, 'i') }] },
                    { $or: [{ "description": new RegExp(description, 'i') }] }
                ]
            });
        } else if (title && description) {
            bugs_list = await Issues.find({
                $and: [
                    { project: req.params.id },
                    { $or: [{ "title": new RegExp(title, 'i') }] },
                    { $or: [{ "description": new RegExp(description, 'i') }] }
                ]
            });
        } else if (author) {
            bugs_list = await Issues.find({ project: req.params.id, "author": new RegExp(author, 'i') });
        } else if (search_labels) {
            bugs_list = await Issues.find({ project: req.params.id, labels: { $in: search_labels } });
        } else if (description) {
            bugs_list = await Issues.find({ project: req.params.id, "description": new RegExp(description, 'i') });
        } else if (title) {
            bugs_list = await Issues.find({ project: req.params.id, "title": new RegExp(title, 'i') });
        } else {
            bugs_list = await Issues.find({ project: req.params.id });
        }

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