const { google } = require('googleapis');
const User = require('./user.model');

const createEvent = async (userId, details) => {
    try {
        const user = await User.findById(userId); 
    
        if (!user || !user.googleAccessToken) {
          throw new Error('No Google access token found');
        }
    
        const oAuth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        oAuth2Client.setCredentials({
          access_token: user.googleAccessToken,
          refresh_token: user.googleRefreshToken,
        });
    
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    
        const eventStartTime = new Date();
        eventStartTime.setHours(eventStartTime.getHours() + 1); // Example: event 1 hour from now
        const eventEndTime = new Date(eventStartTime);
        eventEndTime.setHours(eventStartTime.getHours() + 1); // Event duration of 1 hour
    
        const event = {
          summary: details.summary,
          location: details.location,
          description: details.description,
          start: {
            dateTime: eventStartTime,
            timeZone: 'America/New_York',
          },
          end: {
            dateTime: eventEndTime,
            timeZone: 'America/New_York',
          },
        };
    
        // Insert the event into the user's calendar
        const eventResponse = await calendar.events.insert({
          calendarId: 'primary',
          resource: event,
        });
    
        return eventResponse.data;
      } catch (err) {
        throw err;
      }
    }

    module.exports = { createEvent };