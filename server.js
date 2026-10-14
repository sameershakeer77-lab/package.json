const webpush = require('web-push');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Essential so your HTML file can communicate with this server

// Replace these later
webpush.setVapidDetails(
    'BDss_zpq3LAVp5drkz9NbEWBzJ-YqIRn5XOjcSi8IwsjVzwOGpMN4XZ4DAZkoxrHw9qcZxRcnJxQNYWuv9XVDIY',
    'UHVNscgwax5OM-sdj_dUz5A1I3i8fWYDjrjHexUySUw',
        'sameershakeer77@gmail.com'

);

let userSubscription = null;

// Frontend HTML sends subscription here
app.post('/save-subscription', (req, res) => {
    userSubscription = req.body;
    console.log("Browser subscription saved!");
    res.status(200).json({ message: 'Success' });
});

// Google Sheets sends SMS text here
app.post('/sheet-updated', (req, res) => {
    const newSmsText = req.body.smsText;

    if (!userSubscription) {
        return res.status(400).send('No browser subscribed yet.');
    }

    const payload = JSON.stringify({
        title: "New SMS Logged",
        message: newSmsText
    });

    webpush.sendNotification(userSubscription, payload)
        .then(() => res.status(200).send('Push sent!'))
        .catch(err => {
            console.error("Push Error:", err);
            res.status(500).send('Error sending push');
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
