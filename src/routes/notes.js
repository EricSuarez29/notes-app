const router = require('express').Router();

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req, res)=>{
    res.render('notes/new-note')
})

router.post('/notes/new-note', isAuthenticated, (req, res)=>{
    const { title, description } = req.body;
    
    const errors = [];
    if(!title){
        errors.push({text: 'Porfavor Escriba un titulo'});
    }
    if(!description){
        errors.push({text: 'Porfavor escriba una descripción'});
    }
    if(errors.length > 0){
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        const note = new Note({title, description});
        note.user = req.user.id;
        req.flash('success_msg', 'Nota Agregada satisfactoriamente');
        note.save((err, noteDB)=>{
            if(err){
                res.status(400).json({
                    ok: false,
                    error: err
                })
            }
            if(!noteDB){
                res.status(500).json({
                    ok: false,
                    error: 'Error del servidor'
                })
            }
            res.redirect('/notes')
        })
    }
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res)=>{
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', {note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res)=>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Nota Actualizada satisfactoriamente')
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota Eliminada satisfactoriamente')
    res.redirect('/notes');
});

router.get('/notes', isAuthenticated, async (req, res)=>{
    const notes = await Note.find({user: req.user.id}, 'title description date')
        .sort({date: 'desc'}).lean();
    res.render('notes/all-notes', { notes });
});

module.exports = router;