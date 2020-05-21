const handleSignin = (req, res, bcrypt, db) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json('incorrect form submission');
        // return stops the execution of handleRegister() here
    }
   
    db.select('email', 'hash').from('login') // login database
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
                            //compare input data vs hash(password) data from login database
                            // returns true or false
            if(isValid) {
                return db.select('*').from('users') // all data from users database
                .where('email', '=', email)
                .then(user => {                   
                    res.json(user[0])
                })
                .catch(err=> res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
};

module.exports = {handleSignin};