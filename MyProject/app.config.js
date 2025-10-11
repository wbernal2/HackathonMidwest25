const fs = require('fs');
const path = require('path');

// Load .env into process.env
require('dotenv').config();

// Read existing app.json if present to preserve other config
let appJson = {};
const appJsonPath = path.resolve(__dirname, 'app.json');
if (fs.existsSync(appJsonPath)) {
  appJson = require(appJsonPath);
}

const expo = appJson.expo || {
  name: 'myproject',
  slug: 'myproject',
};

expo.extra = expo.extra || {};
// Support both plain and EXPO_PUBLIC_ variants so runtime picks up the key regardless of naming
expo.extra.GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';
expo.extra.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY || '';

module.exports = {
  expo,
};
