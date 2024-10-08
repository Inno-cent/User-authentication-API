const jwt = require('jsonwebtoken');
const user = require('../models/User')

exports.protect = async(req, res, next)=> {
    let token;

    if(req.headers.authorization && req.headers.authorization.startswith('Bearer')){
        try{
            
        }
    }
}