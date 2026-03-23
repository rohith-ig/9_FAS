const jwt = require('jsonwebtoken');
const qs = require('querystring');
const { ref } = require('process');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const prisma = require('../config/database.js');
const dotenv = require('dotenv');
dotenv.config();

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
            return res.redirect(process.env.REDIRECT_URI); //handle this later to show user doesnt exist and ask them to contact admin
        }
        if (find.profilePic.length === 0) {
            await prisma.user.update({
                where: { email: userEmail },
                data: { profilePic: payload.picture },
            });
        }
        const token = jwt.sign({ userId: find.id, role: find.role }, process.env.JWT_SECRET, { expiresIn: '30m' });
        console.log("User authenticated successfully:", userEmail, token);
        res.redirect(`${process.env.REDIRECT_URI}/login?token=${token}`);
    } catch (error) {
        console.error('Error in callback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
  callback,
};