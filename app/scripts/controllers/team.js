'use strict';

angular.module('iGemPlates2014App')
  .controller('TeamCtrl', function ($scope, $http) {
    $http.get('teams.json').success( function(data, status, headers, config) {
        console.log(data)
        $scope.entries = data;
    });

    $scope.criteria = {};
    $scope.criteria.Abstract = "";

    $scope.phraseOrder = function(entry) {
    	//console.log($scope.criteria.Abstract);
   		return 1;
	};

    function tfidf(entry){
	// This function ranks the given documents according to query document
	
	// Preprocessing
	for (var i = 0; i < documentList.length; i++) {
		documentList[i] = process(documentList[i]);
	}
	queryWords = process(queryText);
	// Calculating word count per document
	var wordAndCount = []
	for (var i = 0; i < queryWords.length; i++) {
		var word = queryWords[i];
		var countList = [];
		for (var j = 0; j < documentList.length; j++){
			var count = 0;
			var documentWords = documentList[j];
			for (k = 0; k < documentWords.length; k++){
				if (word == documentWords[k]){
					count ++;
				}
			}
			countList.push(count);
		wordAndCount.push([word, countList]);
		}
	}
	// calculating score per document
	var scores = new Array(documentList.length);
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
			scores[j] +=  Math.log(wordAndCount[i][1][j] + 1) * Math.log(documentList.length/(1+ documentCount)) // tf * idf
		}
	}
	
	// Producing the final result and sorting it
	var resultsList = []
	for (var i = 0; i < documentList.length; i++){
		resultsList.push([i, scores[i]]);
	}
	resultsList.sort(function(a,b){
		return b[1]- a[1];
	});
	return resultsList;
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
	
	splitted = text.split(" ");
	
	
	// Stop words are common words that should be removed before similarity test
	var stopWords = ["a","and", "the", "that", "so","which", "but", "are",
	                 "is", "also", "though","it", "that",];
	for (var i = 0; i < stopWords.length; i++){
		var word = stopWords[i];
		while (splitted.indexOf(word) !== -1){
			splitted.splice(splitted.indexOf(word),1);
		}
	}
	return splitted;
}
  });
