app.controller('doctorCtrl', function($scope, $location,doctorService){
	$scope.register = function(data){
        $location.path('/login')
		doctorService.save(data)
	}
})

app.service("doctorService", ['$http', function($http){
	this.save = function(data){
		return $http.post('/doctor', data)
	}
}])