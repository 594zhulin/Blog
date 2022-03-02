const jwt = require('jsonwebtoken');

const secret = 'zhulin_blog';

const setToken = (username, userid) => {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            username,
            userid
        }, secret, { expiresIn: 60 * 60 * 24 });
        resolve(token);
    })
}

const getToken = token => {
    return new Promise((resolve, reject) => {
        const info = jwt.verify(token.split(' ')[1], secret);
        resolve(info);
    })
}

module.exports = {
    secret,
    setToken,
    getToken
}