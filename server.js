require('dotenv').config()
const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
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
        const { access_token, refresh_token } = JSON.parse(body)
        res.send('<p style="color: rgb(255,0,0);">Access Token: </p>' + access_token + '<br />Refresh Token: ' + refresh_token)
    })
})

function refreshAccessToken() {
    const refreshToken = process.env.REFRESH_TOKEN
    const lastRefreshDate = new Date(process.env.LAST_REFRESH_DATE)

    const today = new Date()
    const daysSinceLastRefresh = Math.ceil((today - lastRefreshDate) / (1000 * 60 * 60 * 24))

    if (daysSinceLastRefresh >= 30) {
        request.post({
            url: 'https://www.linkedin.com/oauth/v2/accessToken',
            form: {
                grant_type: 'refresh_token',
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                refresh_token: refreshToken
            }
        }, (err, res, body) => {
            if (err) {
                console.error('Error refreshing access token:', err)
                return
            }
            const responseBody = JSON.parse(body)
            const newAccessToken = responseBody.access_token
            const newRefreshToken = responseBody.refresh_token

            console.log('Body:', responseBody)
            console.log('New access token:', newAccessToken)
            console.log('New refresh token:', newRefreshToken)
        })
    }
}

// Call refreshAccessToken on server start
refreshAccessToken()

// Refresh the access token every 30 days
setInterval(refreshAccessToken, 1000 * 60 * 60 * 24)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})