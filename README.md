# LinkedIn OAuth 2.0

## Configuration

1. Go to the [LinkedIn Developer Console](https://www.linkedin.com/developers/apps) and create a new app.
2. Copy the `Client ID` and `Client Secret` from the app settings.
3. Apply the scopes you need 
4. Add the `Redirect URL` to the app settings.

## Installation

Install the dependencies:

```bash
npm install
```

## Usage

Create a `.env` file in the root of the project and add the following:

```env
CLIENT_ID=<client_id>
CLIENT_SECRET=<client_secret>
REDIRECT_URI=<redirect_uri>
```

Replace `<client_id>` and `<client_secret>` with the `Client ID` and `Client Secret` from the LinkedIn app settings.

Start the server:

```bash
node server.js
```

Open your browser and navigate to `http://localhost:3000`. Click the `Login with LinkedIn` button and authorize the app. You will be redirected to the `Redirect URL` with the `code` in the query string. The server will exchange the `code` for an `access_token` and log them to the console.

