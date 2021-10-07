# KalturaMediaPicker

## Setup development environment
Run `npm install`

## Run the development playground
1. Run `npm start`
2. Open `http://localhost:4200/` in the browser.

## Create a deployable version
1. Run `npm run deploy`
2. deploy to npm from `dist/libs/media-query`

## How to update gh-pages
1. Run `npm run gh-pages:publish`

## Open Tasks
- [ ] update the package name, company, author etc in `libs/media-query/package.json`
- [ ] create the deployment `dist/libs/media-query` and test it in a playground that consume the umd file directly
  - the umd and ems files are deployed to gh-pages like https://esakal.github.io/kaltura-media-picker/media-query.umd.js
- [ ] add documentation
