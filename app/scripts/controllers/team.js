'use strict';

angular.module('iGemPlates2014App')
.controller('TeamCtrl', function ($scope, $http) {
	$http.get('teams.json').success( function(data, status, headers, config) {
		//console.log(data)
		$scope.entries = data;
	});

	$scope.criteria = {};
	$scope.criteria.Abstract = "";

	$scope.onlyOverZero = function(entry){
		if(entry.Score == null){
			return true;
		}
		return entry.Score > 0;
	}

	$scope.phraseSearch = function() {
	// This function ranks the given documents according to query document
	var d = new Date();
	var startingTime = d.getTime();

	if($scope.entries == null){
		return $scope.entries;
	}

	// Preprocessing
	for (var i = 0; i < $scope.entries.length; i++) {
		$scope.entries[i].SearchText = process($scope.entries[i].Abstract);
		$scope.entries[i].SearchText.push.apply($scope.entries[i].SearchText, process($scope.entries[i].Description));
	}
	var queryWords = process($scope.criteria.Abstract);
	console.log(queryWords);
	// Calculating word count per document
	var wordAndCount = []
	d = new Date();
	console.log("before queryWords count: ");
	console.log(d.getTime() - startingTime);
	var countList = [];
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
		}
		wordAndCount.push([word, countList]);
	}
	d = new Date();
	console.log("after queryWords count and before scores calculation: ");
	console.log(d.getTime() - startingTime);

	// calculating score per document
	var scores = new Array($scope.entries.length);
	console.log("ASDAFSGASFDGSAFDGFSD");
	for (var i = 0; i < wordAndCount.length; i++){
		// Calculating document count for each word
		var documentCount = 0;
		console.log(wordAndCount[i][1].length);
		for (var j = 0; j < wordAndCount[i][1].length; j++){
			if (wordAndCount[i][1] > 0){
				documentCount ++;
			}
		}
		for (var j = 0; j < wordAndCount[i][1].length; j++){
			if (!scores[j]){
				scores[j] = 0
			}
			scores[j] +=  Math.log(wordAndCount[i][1][j] + 1) * Math.log($scope.entries.length/(1+ documentCount)) // tf * idf
		}
	}
	d = new Date();
	console.log("after scores calculation: ");
	console.log(d.getTime() - startingTime);
	
	// Producing the final result and sorting it
	for (var i = 0; i < $scope.entries.length; i++){
		$scope.entries[i].Score = scores[i];
	}
	console.log("after scores adding: ");
	console.log(d.getTime() - startingTime);

	return $scope.entries;
}

function splitByWord(text,word){
	var splitted = text.split(word);

	return splitted.length;
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
	var stopWords = ["that","but", "we", "the", "which","a", "as", "an","in","while","with",
	"then", "also", "just","this", "use","is","into","for","both","our","will","able","team","project","if"];
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
