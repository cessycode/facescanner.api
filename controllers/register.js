
const handleRegister = (req, res, db, bcrypt) => {
    const {name, email, password} = req.body; // from user input
    if(!name || !email || !password) {
        return res.status(400).json('incorrect form submission');
        // return stops the execution of handleRegister() here
    }

    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            //db.transaction() from knex
            // connects two databases to avoid inconsistencies

            trx.insert({
                hash: hash,
                email: email
            })
            .into('login') // login database
            .returning('email')
            .then(loginEmail => {  // refers to the data from (returning('email'))
                return trx('users') // users database
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                    res.json(user[0]);
                    })
            })
            .then(trx.commit) //commit if everything succeeds
            .catch(trx.rollback) // rollback if anyting fails
        })         
    .catch(err => res.status(400).json('unable to register'))}

   module.exports = {handleRegister};