const Category = require('../schema/category');
const admin = 'ADMIN';
const member = 'MEMBER';

exports.getCategories = (req, res, next) => {
    Category.find().then(data => {
        res.status(200).json({
            message: 'Categories retrieved successfully!',
            categories: data
        });
    });
}

exports.createCategory = (req, res, next) => {
    const category = new Category({
        title: req.body.title
    });
    category.save().then(createdCategory => {
        res.status(201).json({
            message: 'Category added successfully',
            category: {
                id: createdCategory._id,
                title: createdCategory.title
            }
        });
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    });
}

exports.deleteCategory = (req, res, next) => {
    Category.deleteOne({ _id: req.params.id }).then(result => {
        if (!result) {
            return res.status(404).json({
                message: 'card not found with id ' + req.body.id
            });
        }
        res.status(200).json({ message: 'card deleted successfully!' });
    }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                message: 'card not found with id ' + req.body.id
            });
        }
        return res.status(500).json({
            message: 'Could not delete card with id ' + req.body.id
        });
    });
}

exports.editCategory = (req, res) => {
    if (req.userData.role === admin || req.userData.role === member) {
        Category.findByIdAndUpdate(req.params.id, req.body).then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Category not found with id ' + req.body.id
                });
            }
            res.status(200).json({ message: 'Category updated succeccfully!' });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).json({
                    message: 'Category not found with id ' + req.body.id
                });
            }
            return res.status(500).json({
                message: 'Could not update category with id ' + req.body.id
            });
        });
    } else {
        return res.status(403).json({ message: 'Not Authorized!' });
    }    
}