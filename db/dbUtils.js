const uniqid = require('uniqid');

const getAllNotes = (cb) => {
    cb(repos);
};

const addNote = (note,cb) => {
    const newNote = {
        title: note.title,
        text: note.text,
        id: uniqid(),
    }

    getAllNotes((notes) => {
        const existingNotes = JSON.parse(notes);
        const newData = [...existingNotes, newNote];

        fs.writeFile('db/db.json', JSON.stringify(newData, null, 2),
        cb(newNote));
    });
};

const deleteNote = (id,cb) => {

}

module.exports = {
    getAllNotes,
    addNote,
    deleteNote
}