This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Initializing Node Modules and Starting Node Server

To install all necessary node modules:

```bash
pnpm install
```

If test data is needed, uncomment the InitiateTestData() line in server.js

## Additional Progams Needed

This app runs on mongodb, so database authentication is needed before running the application.

Create a .env file in the node-server directory and add the DB_URI, and PORT=4000 into the file. Be ready to enter the db admin username and password after application start.

This app also uses cloudinary for profile image storage, so cloudinary API authentication is needed before running the application.

After gaining access to the cloudinary application image folder through making an account, put the CLOUD_NAME, API_KEY, and API_SECRET in the .env folder.

## New Features

- Notification system for friend requests, study requests
- on-platform study request feature, using notification system, including information like other users to study with (forming a study group), time (or available times), and study locations (available times) -> connected to email to notify users about study request
- Add feature to select study areas or book library study rooms through platform, w/ study request feature
- Connect website to email for friend requests, study requests notifications
- add auto content moderation for profile images, and user bios using google cloud vision api
- add manual content moderation feature (allowing users to become content moderators), can “ban” users, see “ban” appeals
  - add ban feature, person is locked out of using platform, can send ban appeals to mods
- add spamming filter feature for incoming requests and friends (if someone deletes an incoming request or friend, the recipient cannot send another request for some time)
- add block feature (one person can block someone else’s profile, cannot see on explore page, cannot send friend request)
- add/design landing page

## Design Issues/Additional Implementations

- Make website look good on big screens, [like what is seen here](http://whatismyscreenresolution.net/multi-screen-test?site-url=http://localhost:3000/login&w=1920&h=1200)
- Make website look good on screen resizes
- Make website look good on mobile screens
- Add closing animation for profile cards on explore
- Redesign infinite load, have lazy load card design like reddit

## System Design Issues/Additional Implementations

- Move all data processing to backend (only processing on frontend should be transforming data into display elements)- should reduce lagging
- Add timeout for button backend calls to stop breaking on spam of button
- Implement redis cache to contain user profile data, user requests- should reduce lagging
- check for unused dependencies using depcheck
- deploy to vercel
- deploy to aws
