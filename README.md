# garage-sanity-frontend

## Git Flow

- This project uses `git-flow` for versioning
- Install `git-flow` on your system
  - For linux `$ apt-get install git-flow`
- Documentation
  - http://danielkummer.github.io/git-flow-cheatsheet/
  - https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow

## Running locally

- Start the development server with `$ npm start`
- Create a production build with `$ npm run build`
  - Serve the static bundle using `serve`
  - Install `serve` with `$ npm install -g serve`
  - Serve the static assets with `$ serve -s build`

## Deployment

- Create a release branch using [git flow](#git-flow)
  - Bump the version number in `package.json`
  - Run `$ npm install` and any other last minute tasks
- Finish the release branch and push all branches to the remote (including the new tag)
- From the `master` branch build and deploy the production bundle
  - First creat the bundle with `$ npm run build`
  - Then use PM2 to serve the static files
  - `$ pm2 serve build 3000 --spa --name garage-sanity-frontend`

## Deployment to rpi

- The Raspberry Pi does not have the resources to build the frontend locally
- Upon the pushing of a new git tag, a GitHub action will dispatch to build the frontend
  - SSH into the rpi
  - `$ cd ~/garage-sanity-frontend`
  - `$ wget` the release from GitHub to `garage-sanity-frontend`
  - Extract with `$ tar -xvzf garage-sanity-frontend-v{{ BUILD_VERSION }}.tar.gz`
  - Rename `build` to `{{ BUILD_VERSION }}`
  - Stop the frontend from running on PM2 with `$ pm2 stop garage-sanity-frontend`
  - Start the frontend with PM2 with `$ pm2 serve {{ BUILD_VERSION }} 3000 --spa --name garage-sanity-frontend`

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
