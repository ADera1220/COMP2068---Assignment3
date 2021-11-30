// Global Configuartion Variables
module.exports = {
    // Database connection
    'db': 'mongodb+srv://adera:5D8DZpw2Z8Vq9up@cluster0.zvwbu.mongodb.net/playcalendar',
    'gitHub': {
        'clientID': '8304cb5b8bc8a1433be9',
        'clientSecret': '51c89750599131d6d8b0ea6197e95421aa58cf26',
        'callbackURL': 'https://play-calendar.herokuapp.com/github/callback'
    },
    'google': {
        'clientID': '769102508683-7hi6m462u5a6h27k3qd2fdrtun91gfot.apps.googleusercontent.com',
        'clientSecret': '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',
        'callbackURL': 'https://play-calendar.herokuapp.com/google/callback'
    }
}