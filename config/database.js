if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://TareqJarwan:1234@ds141661.mlab.com:41661/vid_jot_prod'
    };
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    };
}