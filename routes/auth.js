var express = require('express');
var router = express.Router();
const axios = require('axios');

router.get('/', function (req, res, next) {
    const csrfState = Math.random().toString(36).substring(2);
    res.cookie('csrfState', csrfState, {
        maxAge: 60000
    });
    console.log(process.env.SERVER_ENDPOINT_REDIRECT);

    let url = 'https://www.tiktok.com/v2/auth/authorize/';
    url += `?client_key=${process.env.CLIENT_KEY}`;
    url += '&scope=user.info.basic';
    url += '&response_type=code';
    url += `&redirect_uri=${process.env.SERVER_ENDPOINT_REDIRECT}`;
    url += '&state=' + csrfState;

    console.log(url);
    res.redirect(url);
});

router.get('/tiktok/callback', async (req, res) => {
    const {
        code,
        state
    } = req.query;
    const csrfState = req.cookies.csrfState;

    if (state !== csrfState) {
        return res.status(403).send('Invalid CSRF state');
    }

    try {
        const response = await axios.post('https://www.tiktok.com/v2/auth/token/', null, {
            params: {
                client_key: process.env.CLIENT_KEY,
                client_secret: process.env.CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.SERVER_ENDPOINT_REDIRECT
            }
        });

        const accessToken = response.data.access_token;
        // Sử dụng accessToken để gọi các API khác của TikTok

        res.json({
            accessToken
        });
    } catch (error) {
        res.status(500).send('Error fetching access token');
    }
});

module.exports = router;