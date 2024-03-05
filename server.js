require('dotenv').config()
const express = require('express')
const request = require('request')
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.static('public'))

// Route to start the OAuth flow
app.get('/auth/linkedin', (req, res) => {
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=r_ads%20rw_ads`;

    res.redirect(linkedInAuthUrl)
})

// Route to handle the redirect from LinkedIn
app.get('/auth/linkedin/callback', (req, res) => {
    const { code } = req.query
    const options = {
        method: 'POST',
        url: 'https://www.linkedin.com/oauth/v2/accessToken',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.REDIRECT_URI,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        }
    }

    request(options, function (error, response, body) {
        if (error) throw new Error(error)
        const { access_token } = JSON.parse(body)
        res.send('Access Token: ' + access_token)
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})