

// create a white list 
const whiteList = ['http://127.0.0.1:3500',
                  'http://127.0.0.1:8000',
                  'https://www.google.com',
                  'http://www.one.co.il'];

const corsOpt = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }else {
            callback(new Error('cors not allowing'));
        }
    },
    optionSuccessStatus : 200,
};

module.exports = {corsOpt, whiteList};

