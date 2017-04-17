var edge = require('../lib/edge.js'), assert = require('assert'), path = require('path');

var edgeTestDll = process.env.EDGE_USE_CORECLR ? 'test' : path.join(__dirname, 'Edge.Tests.dll');

describe.only('serialization', function () {

    it('complex exception serialization', function (done) {
        var func = edge.func({
            source: process.env.EDGE_USE_CORECLR ?
                function () {/*
                 #r "System.Data.Common"

                 using System.Data;

                 async (input) =>
                 {
                     using (SqlConnection connection = new SqlConnection("Data Source=localhost;Initial Catalog=catalog;Integrated Security=True;Connection Timeout=3"))
                     {
                         connection.Open();
                     }

                 }
                 return input.ToString();
                 */} :
                function () {/*
                 #r "System.Data.dll"

                 using System.Data;
                 using System.Data.SqlClient;

                 async (input) =>
                 {

                     using (SqlConnection connection = new SqlConnection("Data Source=localhost;Initial Catalog=catalog;Integrated Security=True;Connection Timeout=3"))
                     {
                         connection.Open();
                     }
                     return input.ToString();

                 }
                 */}
        });
        assert.throws(
            function () {func("JavaScript", function (error, result) {})},
            /A network-related or instance-specific error occurred while establishing a connection to SQL Server'/
        );
    });

});