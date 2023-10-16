## About

This is my solution for the 1st project assignemnt for the WEB2 course at the Faculty of Electrical Engineering and Computing (FER), Universiti of Zagreb, Croatia.

It is a web application that allows authenticated users to create a new tournament, add players to it and choose a point system. The application then generates tournament rounds and matches using the Round Robin single cycle algorithm. The user can then enter the results of the matches and the application will calculate the final standings of the tournament.

## Technologies

The application is written in **Next.js 13**, using TypeScript. It uses Next's new **App Router** that utilizes React's new **Suspense** features and allows the pages to be pre-rendered on the server and served to the user as each part of the page is loaded. The loading transitions are achieved with *Skeleton* components. This allows for a much faster initial load time and a better user experience.

For the UI, the application uses **shadcn/ui** components, which are built on top of **Radix UI** using **TailwindCSS**. The UI is fully responsive and works on all screen sizes. It also utilizes light and dark modes, as well as a system mode that changes the theme based on the user's system settings.

Firebase's **Firestore** is used for the web app's database using nested collections for tournaments, rounds and pairs.

Auth0 is used for authentication. The application uses Auth0's email and password authentication. When creating a tournament, the user's **sub** is written to the tournament document in Firestore, which is then used to allow only the creator of the tournament to edit it.

The application is hosted on **Vercel** and can be accessed at [https://web2-round-robin-tournament.vercel.app/](https://web2-round-robin-tournament.vercel.app/).

## Usage

When first accessing the app, the user is greeted with a index page displaying all currently registered tournaments. The user can click to view each tournament, see the results for each match in each round as well as the current standing for all players.

On the index page the user can also add a new tournament by clicking the **+** icon button in the bottom right corner after which a dialog window is triggered.

If the user isn't logged in, they will be prompted to log in using Auth0. After logging in, the user can once again click the **+** icon button to add a new tournament after which a dialog window is triggered, this time with a form for adding a new tournament.

When adding a new tournament, the user can enter the tournament name, add players to the tournament and choose a point system. The users are separated by a **semicolon (;)** and the available point systems are **Football (3/1/0)**, **Chess (1/0.5/0)** and **Basketball (2/0/1)**.
