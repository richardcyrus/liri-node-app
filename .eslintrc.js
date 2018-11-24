module.exports = {
    "extends": "standard",
    "rules": {
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "linebreak-style": ["warn", "unix"],
        "quotes": ["warn", "single"],
        "semi": ["warn", "always"],
        "no-cond-assign": ["error", "always"],
        "no-console": "off",
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "env": {
        "node": true
    }
};
