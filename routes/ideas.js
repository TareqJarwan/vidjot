const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    ensureAuthenticated
} = require('../helper/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea: idea
                });
            }
        });
});

// Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({
            user: req.user.id
        })
        .sort({
            date: "desc"
        })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });

});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: 'Please add a title'
        });
    }

    if (!req.body.details) {
        errors.push({
            text: 'Please add  some details'
        });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video idea added successfully');
                res.redirect('/ideas');
            });
    }
});

// Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video idea updated successfully');
                    res.redirect('/ideas');
                });
        });
});

// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({
            _id: req.params.id
        })
        .then(() => {
            req.flash('success_msg', 'Video idea removed successfully');
            res.redirect('/ideas');
        });
});

module.exports = router;