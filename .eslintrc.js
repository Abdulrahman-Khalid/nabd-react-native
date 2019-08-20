module.exports = {
  "extends": ["airbnb"],
  "plugins": [
      "react"
  ],
  "parser": "babel-eslint",
  "rules": {
    "no-underscore-dangle": 0,
    "import/prefer-default-export": 0,
    "arrow-parens": [1, "always"],
    "class-methods-use-this": 0,
    "no-case-declarations": 0,
    "import/no-named-as-default": 0,
    "new-cap": 0,
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-useless-constructor": 0,
    "linebreak-style": 0,
    "eol-last": 0,
    "object-curly-newline": 0,
    "no-unused-vars": 0,
    "global-require": 0,
    "comma-dangle": 0,
    "max-len": 0,
    "dot-notation": 0,
    "spaced-comment": 0,
    "no-undef": 0,
    "no-unused-expressions": 0,
    
    "react/forbid-prop-types": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/jsx-no-bind": 0,
    "react/destructuring-assignment": 0,
    "react/prop-types": 0,
    "react/no-unescaped-entities": 0,
    "react/jsx-no-duplicate-props": 0,
    "react/jsx-max-props-per-line": 0,
    "react/jsx-one-expression-per-line": 0,
    "react/prefer-stateless-function" : 0,
    "react/require-default-props": 0,
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
};