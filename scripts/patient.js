app.controller('patientDetailsCtrl', function($scope,$location, patientService){
$scope.currentDoctor = patientService.getCurrentDoctor().fullname
	$scope.patient = {}

    $scope.patient._id = patientService.getPatientDetails()._id
    $scope.patient.firstname = patientService.getPatientDetails().firstname
    $scope.patient.lastname = patientService.getPatientDetails().lastname
    $scope.patient.email = patientService.getPatientDetails().email
    $scope.patient.age = patientService.getPatientDetails().age
    $scope.patient.familyDoctor = patientService.getPatientDetails().familyDoctor

    $scope.register = function(data){
		patientService.save(data)
        $location.path('/patientsearch')
        $scope.clearForm();
	}
    $scope.update = function(data){
		patientService.update(data)
        $location.path('/patientsearch')
	}

	$scope.clearForm = function(){
		$scope.patient = {}
	}
    //***********************************************************
    $scope.selectedDoctor = function (doctor) {
        $location.path('/patientdetails')
        patientService.setDoctorDetails(doctor)
    };
    
    patientService.getDoctors().success(function (doctor) {
		$scope.currentPage = 0;
		$scope.pageSize = 10;
		$scope.data = doctor;
		$scope.numberOfPages = function () {
			return Math.ceil($scope.data.length / $scope.pageSize);
		}
		for (var i = 0; i < 45; i++) {
			$scope.doctorModel = $scope.data;
		}
	});
})
app.controller("mainController", function ($scope, $location, patientService) {

	$scope.currentDoctor = patientService.getCurrentDoctor().fullname
});
app.controller("DoctorLogInController", function ($scope, $location, patientService) {
$scope.currentDoctor = patientService.getCurrentDoctor().fullname

	$scope.loginDoctor = function (doctor) {
        console.log(doctor);
		patientService.getDoctor(doctor).success(function (data) {
            console.log(data);
			if (doctor.fullname == data.fullname && doctor.password == data.password) {
				patientService.setCurrentDoctor(data);
				$location.path('/patientsearch');
			} else {
				$location.path('/register');
			}
		});
	}
    
    
});
app.controller('patientListCtrl', function($scope, $location, patientService){
    $scope.currentDoctor = patientService.getCurrentDoctor().fullname
    
    $scope.sortType     = 'name';
	$scope.sortReverse  = false;  // set the default sort order
  	$scope.searchValue   = '';
    $scope.search = [];
    $scope.patientList = [];
    
    patientService.getPatients().success(function(data){
		$scope.patientModel = data
	})

	 $scope.selectedPatient = function (patient) {
        $location.path('/patientdetails')
        patientService.setPatientDetails(patient)
    };

})

app.controller('patientSearchCtrl', function ($scope, $route, $location, patientService) {
    $scope.currentDoctor = patientService.getCurrentDoctor().fullname
    console.log($scope.currentDoctor);
    
    $scope.sortType     = 'name';
	$scope.sortReverse  = false;  // set the default sort order
  	$scope.searchValue   = '';
    $scope.search = [];
    $scope.patientList = [];
    
    $scope.selectedPatient = function (patient) {
        $location.path('/patientdetails')
        patientService.setPatientDetails(patient)
    };
    $scope.editPatient = function (patient) {
        $location.path('/update')
        patientService.setPatientDetails(patient)
    };
    
    
    patientService.getPatient().success(function (patient) {
		$scope.currentPage = 0;
		$scope.pageSize = 5;
		$scope.data = patient;
		$scope.numberOfPages = function () {
			return Math.ceil($scope.data.length / $scope.pageSize);
		}
		for (var i = 0; i < 45; i++) {
			$scope.patientModel = $scope.data;
		}
	});
    
    $scope.searchLastName = function(patient){
    	console.log("patient: "+patient)
    	patientService.getPatientsByLastName(patient).success(function(patient){
			$scope.search = patient
    	}).error(function(data, status){
    	})
    }	

    $scope.deletePatient = function (patient) {
		patientService.deletePatient(patient).success(function (data) {
        });
        $route.reload();
	}
})

app.controller("patientUpdateController", function ($scope, $location, patientService) {

    $scope.editPatient = function (patient) {
        $location.path('/update')
        patientService.setPatientDetails(patient)
    };
	
});

app.service("patientService", ['$http', function($http){
	var patientDetails = {};
    var doctorDetails = '';
    var currentDoctor = {};

	this.save = function(data){
		return $http.post('/patient', data)
        }
    this.update = function(data){
		return $http.post('/updatepatient', data)
        }
    
    this.deletePatient = function (data) {
		return $http.post('/deletepatient',data)
	}
        
    this.getPatient = function (data) {
        return $http({
            method: "GET",
            url: '/getpatients',
            data: data,
            cache: true
        })
    };
    
    this.getPatientsByLastName = function (patient) { 
            return $http.get('/patient/'+patient)
    }
    //*****************************************
    this.getDoctors = function (data) {
        return $http({
            method: "GET",
            url: '/getdoctors',
            data: data,
            cache: true
        })
    };
    //for doctor login
    this.getDoctor = function (data) {
		return $http.get('/getDoctor', {
			params: {
				fullname: data.fullname,
                password: data.password
			}
		});
	};


	this.getPatients = function(){
		return $http.get('/getpatients')
        }
    
    this.setDoctorDetails = function (value) {
        doctorDetails = value
    };
    this.getDoctorDetails = function () {
        return doctorDetails
    };

	this.setPatientDetails = function (value) {
        patientDetails = value
    };

    this.getPatientDetails = function () {
        return patientDetails
    };
    
    this.setCurrentDoctor = function (value) {
		currentDoctor.fullname = value.fullname;
	}

	this.getCurrentDoctor = function () {
		return currentDoctor;
	}
}])

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});