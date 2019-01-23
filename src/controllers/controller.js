require('dotenv').config();


module.exports = {

postMessage: (req, res) => {
    const db = req.app.get('db');
    // const {senderID, text, timeStamp} = req.body;
    const {senderID, text} = req.body;
    console.log('hit here', req.body)
    db.post_message([senderID, text])
        .then((message) => { res.status(200).send(message)})
        .catch(() => res.status(500).send())
},





}