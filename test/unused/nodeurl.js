var nodeurl = require('url');

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

describe('Testing url functionalies', function() {

    it('Should parse relative url ok', function() {

        var urls = [
            '/someSthing',
            'something',
            'something?aa',
            '/something?aa',
            'something?aa=bb',
            '/something?aa=bb',
        ];

        var parsed;

        urls.forEach(function(url) {
            parsed = nodeurl.parse(url);
            expect(parsed).to.be.defined;
        })

    });

    it('Should generate hostname ok', function() {


        var urls = [
            'http://www.google.com/asad?asd#qw',
            'http://www.google.com:456/asad?asd#qw',
            '///qwe.wew.qw.google.com/asad?asd#qw',
            'http://user:pass@www.google.com/asad?asd#qw'
        ];
        
        var parsedUrl,
            relativeUrl,
            domain;

        urls.forEach(function(url) {
            parsedURL = nodeurl.parse(url);
            relativeURL = parsedURL.pathname;

            domain = nodeurl.format(parsedURL);


        })

    });

})
