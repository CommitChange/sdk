# CC SDK

This is the frontend javascript 'SDK' for building CommitChange integrations from third-party clients. For now, it handles the logic and styling of things outside of the actual donate form.

More specifically, the code does the following:  
- parses page and searches for 'commitchange-donate' and reads data attributes
- turns data attributes into url params or post messages to be used in iframe src or iframe post message 
- appends the css for elements outside of the actual donate form 

### Build

Run `npm run build`, which will generate `bundle.js`, which can be copied to the hosted location (for not, it should be copied into `public/js/donate-button.v2.js`).

