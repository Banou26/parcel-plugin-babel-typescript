# Parcel plugin to use Babel instead of TSC

This plugin replace TSC by Babel allowing you to use any babel plugin magic inside `.ts` and `.tsx` files.

### Example:

The proposal/plugin is going to be
https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining

What it does is allow you to do `undefined?.foo` without it throwing an error.

You have to install my plugin and the babel plugins you want to use.

`npm install parcel-plugin-babel-typescript @babel/plugin-proposal-optional-chaining`

Then you need to add the babel configuration needed by my plugin, which is

.babelrc
```json
{
  "presets": [
    "@babel/preset-typescript"
  ]
}
```

And the configuration needed by the babel plugin of your choice

.babelrc
```json
{
  "presets": [
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/plugin-proposal-optional-chaining"
  ]
}
```

And voila, you can use TS/JSX features with Babel's magic at the same time !

```tsx
const foo: number = 1
const bar = foo as unknown as string

const jsxStuff = <div></div>

const baz = undefined?.qux
```