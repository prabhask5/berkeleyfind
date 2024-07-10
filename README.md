This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

To install all necessary node modules:

```bash
pnpm install
```

This project uses custom githooks to manage unused dependencies, to change the folder used to run githook scripts from use the following command:

```bash
git config --local core.hooksPath .githooks/
```

Then to start up the applicatiojn, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
