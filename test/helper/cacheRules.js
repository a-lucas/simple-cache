module.exports = {
    maxAge: [
        {
            domain: /.*/,
            rules: [
                {regex: /maxAge.html$/, maxAge: 1, ignoreQuery: false}
            ]
        }
    ],
    always: [
        {
            domain: /.*/,
            rules: [
                {regex: /always.html$/, ignoreQuery: false}
            ]
        }
    ],
    never: [
        {
            domain: /.*/,
            rules: [
                {regex: /never.html$/, ignoreQuery: false}
            ]
        }
    ],
    default: 'never'
};
