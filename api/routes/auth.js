
const router = require('express').Router();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

passport.use(new FacebookStrategy({
    clientID: "2389720377982988",
    clientSecret: "cb8f2158e103ddb3cc7595b96a2f231e",
    callbackURL: `${process.env.VUE_APP_BASE_API_URI}/auth/facebook/callback`,
    enableProof: true,
    profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'first_name', 'last_name', 'middle_name']
},
    function (facebook_access_token, refreshToken, profile, done) {
        done(null, { profile, facebook_access_token });
    }
));

passport.use('google', new GoogleStrategy({
    clientID: '271549267606-fd6h2lphs0lft2ldg7m22mufau4lo9jq.apps.googleusercontent.com',
    clientSecret: 'ZpwIOSXOLx7hfVn1RCTUbpXR',
    callbackURL: `${process.env.VUE_APP_BASE_API_URI}/auth/google/callback`
},
    function (google_access_token, refreshToken, profile, done) {
        console.log('accessToken :', google_access_token);
        console.log('refreshToken :', refreshToken);
        console.log('profile :', profile);
        done(null, { profile, google_access_token });
    }
));




router.route('/facebook')
    .get(passport.authenticate('facebook', { scope: ["email"] }));

router.route('/facebook/callback')
    .get(passport.authenticate('facebook', {session: false}),(req, res) => {
        res.redirect(`${process.env.VUE_APP_HOME_URI}/#/auth?oauth=facebook&data=${new Buffer(JSON.stringify(req.user)).toString('base64')}`)
    });

router.route('/google')
    .get(passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

router.route('/google/callback')
    .get(passport.authenticate('google', {session: false}), (req, res) => {
        res.redirect(`${process.env.VUE_APP_HOME_URI}/#/auth?oauth=google&data=${new Buffer(JSON.stringify(req.user)).toString('base64')}`)
    });

module.exports = router;

    