# CC SDK

This is the frontend javascript 'SDK' for building CommitChange integrations from third-party clients

## donate-widget

### Build

The production donation button script is located in `/public/js/donate-button.v2.js`

First, back up the existing build:

```sh
cp ../../../../public/js/donate-button.v2.js backup.v2.js
```

Next, browserify the file:

```sh
browserify index.js > build.js
```

Finally, minify (uglify) the js into the public dir:

```sh
uglifyjs build.js > ../../../../public/js/donate-button.v2.js
```

You can install browserify and uglify with npm
