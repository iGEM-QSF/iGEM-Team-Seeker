'use strict';

angular.module('iGemPlates2014App')
  .controller('TeamCtrl', function ($scope, $http) {
    $http.get('teams.json').success( function(data, status, headers, config) {
        console.log(data)
        $scope.entries = data;
    });
  });
