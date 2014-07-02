'use strict';

angular.module('iGemPlates2014App')
.controller('TeamCtrl', function ($scope, $http) {
	$http.get('teams.json').success( function(data, status, headers, config) {
		//console.log(data)
		$scope.entries = data;
	});

	$scope.criteria = {};
	$scope.criteria.Abstract = "";

	$scope.phraseSearch = function() {
	// This function ranks the given documents according to query document
	
	if($scope.entries == null){
		return $scope.entries;
	}

	// Preprocessing
	for (var i = 0; i < $scope.entries.length; i++) {
		$scope.entries[i].SearchText = process($scope.entries[i].Abstract);
	}
	var queryWords = process($scope.criteria.Abstract);
	console.log(queryWords);
	console.log($scope.entries.length);
	// Calculating word count per document
	var wordAndCount = []
	for (var i = 0; i < queryWords.length; i++) {
		var word = queryWords[i];
		var countList = [];
		for (var j = 0; j < $scope.entries.length; j++){
			var count = 0;
			var documentWords = $scope.entries[j].SearchText;
			for (var k = 0; k < documentWords.length; k++){
				if (word == documentWords[k]){
					count ++;
				}
			}
			countList.push(count);
			wordAndCount.push([word, countList]);
		}
	}
	console.log(countList);
	console.log(wordAndCount);

	// calculating score per document
	var scores = new Array($scope.entries.length);
	for (var i = 0; i < wordAndCount.length; i++){
		
		// Calculating document count for each word
		var documentCount = 0;
		for (var j = 0; j < wordAndCount[i][1].length; j++){
			if (wordAndCount[i][1] > 0){
				documentCount ++;
			}	
		}
		// Calcultaing and saving the score
		for (var j = 0; j < wordAndCount[i][1].length; j++){
			if (!scores[j]){
				scores[j] = 0
			}
			scores[j] +=  Math.log(wordAndCount[i][1][j] + 1) * Math.log($scope.entries.length/(1+ documentCount)) // tf * idf
		}
	}
	
	// Producing the final result and sorting it
	var resultsList = []
	for (var i = 0; i < $scope.entries.length; i++){
		$scope.entries[i].Score = scores[i];
	}


	return $scope.entries;
}

function process(text) {
	/*
	 * Delete all punctuation characters, short words and stop words in query text and documents
	 */

	// replace capital letters and remove punctuation
	text = text.toLowerCase();
	text = text.replace(/[\.,!?]/g,"");
	
	// Remove the short words (shorter than 4 characters)
	var pattern = / .{1,3} /g;
	text = text.replace(pattern, " ");
	
	var splitted = text.split(" ");
	
	
	// Stop words are common words that should be removed before similarity test
	var stopWords = ["that","but", "we", "the", "which","a", "as", "an",
	"then", "also", "just","this", "vaan","is"];
	for (var i = 0; i < stopWords.length; i++){
		var word = stopWords[i];
		while (splitted.indexOf(word) !== -1){
			splitted.splice(splitted.indexOf(word),1);
		}
	}
	return splitted;
}

$scope.getScore = function(entry){
	return entry.Score *(-1);
}
});
