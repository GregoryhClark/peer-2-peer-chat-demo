require('dotenv').config();


module.exports = {

postMessage: (req, res) => {
    const db = req.app.get('db');
    // const {senderID, text, timeStamp} = req.body;
    const {senderID, text} = req.body;
    db.post_message([senderID, text])
        .then((message) => { res.status(200).send(message)})
        .catch(() => res.status(500).send())
},
getOtherUsers: (req, res) => {
    const db = req.app.get('db');
    db.get_other_users(req.params.id)
        .then((users) => { res.status(200).send(users) })
        .catch(() => res.status(500).send())
},





}