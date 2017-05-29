# AngularJS/Compass Seed Project


## Initial Setup

Install all nodeJS dependencies defined in package.json:
```
npm install
```

Install all Ruby dependencies defined in Gemfile:
```
bundle install
```

Install all Bower dependencies defined in bower.json:
```
bower install
```

Move Bower dependencies files to src foder:
```
grunt bower
```

## Development

For live development:

```
grunt dev
```

To render your static file output to the ```/app/``` directory:

```
grunt dist
```

To run Jasmine tests:

```
grunt test
```
