const jwt = require('jsonwebtoken');
const qs = require('querystring');
const { ref } = require('process');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const prisma = require('../config/database.js');

const callback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ error: "Authorization code is missing" });
        }
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: qs.stringify({
                    code,
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: process.env.GOOGLE_REDIRECT_URI, 
                    grant_type: 'authorization_code',
            }),
            });
        const tokenData = await tokenRes.json();
        if (tokenData.error) {
            console.error('Error fetching tokens:', tokenData.error);
            return res.status(400).json({ error: 'Error fetching tokens' });
        }
        const ticket = await client.verifyIdToken({
            idToken: tokenData.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log(payload);
        const userEmail = payload.email;
        const find = await prisma.user.findUnique({
            where: {
                email: userEmail,
            },
        });
        if (!find) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(find);
        res.json({ email: userEmail, name: payload.name, picture: payload.picture });
    } catch (error) {
        console.error('Error in callback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
  callback,
};