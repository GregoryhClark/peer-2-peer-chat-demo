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
//THIS IS WHAT THE REAL VERSION WILL LOOK LIKE ONCE WE HAVE THE DATABASE
pastConversation:(req, res) => {
    const db = req.app.get('db');
    const {user1, user2} = req.body;
    db.get_conversation([user1, user2])
        .then((conversation) => { res.status(200).send(conversation)})
        .catch(() => res.status(500).send())
},
//THIS IS TEMPORARY JUST FOR CONCEPT
getAllMessages:(req, res) => {
    const db = req.app.get('db');
    db.get_all_messages()
        .then((messages) => { res.status(200).send(messages) })
        .catch(() => res.status(500).send())
},


}