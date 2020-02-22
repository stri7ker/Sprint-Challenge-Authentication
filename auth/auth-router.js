const router = require('express').Router();
help = require('./helper')
const crit = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {jwtSecret} = require('../secret')



router.post('/register', (req, res) => {
  // implement registration
  let user = req.body
  const hash = crit.hashSync(user.password, 10);
  user.password = hash;
  
  help.addUser(user)
    .then(id => {
      res.status(201).json(id);
    })
    .catch(err => {
      res.status(500).json({message:'Unable to add user'})
    })
});


router.post('/login', (req, res) => {
  // implement login
  const {username, password} = req.body;
  help.findBy({username})
  .then(user => {if (user && crit.compareSync(password, user.password)){
    let token = genToken(user);
    res.status(200).json({message: `Hello ${username}`,
    token : token
  });
  }})
});

function genToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }



  const options = {
    expiresIn: '2h'
  }
  return jwt.sign(payload, jwtSecret, options )
  
}

module.exports = router;
