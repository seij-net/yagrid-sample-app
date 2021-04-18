# yagrid-sample-app

Sample `create-react-app` using yagrid, mainly used to test that npm packages are published and typings available

# Usage

We don't rely on npm link or yarn link to live test because of too many issues
with react. We need to test in a "clean" environment.

* create empty directory
* checkout yagrid
* checkout this directory next to yagrid (same parent folder)
* launch `sync.sh` that will 
    - build yagrid in ../yagrid
    - remove previous imports here
    - copy ../yagrid/dist and ../yagrid/package.json here in `imports/yagrid`
    - launch yarn by installing yagrid using file reference
* you can now use `yarn run start`

It takes some time, but ensures it works properly without publishing to npm.

If yagrid changes, relaunch `sync.sh`