angular.module('usersApp.controllers',[])
.controller('UserLoginController', function($scope, Auth, $state, $window, $cookieStore) {

    $scope.isAuthenticated = function() {
    	var auth = $cookieStore.get('authToken');
        if (auth !== undefined) {
        	return true;
        } else {
        	return false;
        }
    };

    $scope.currentUserId = $cookieStore.get('authId');

    $scope.login = function(email, pass) {
        loginUser(email, pass);
    };

    function loginUser(email, pass) {
        var credentials = {
            email: email,
            password: pass
        };
        var config = {
            headers: {
                'X-HTTP-Method-Override': 'POST'
            }
        };

        Auth.login(credentials, config).then(function(user) {
            $cookieStore.put('authToken', user.token);
            $cookieStore.put('authEmail', user.email);
            $cookieStore.put('authId', user.id);
            $scope.currentUserId = user.id;
        }, function(error) {
            // Authentication failed...
            window.alert("Invalid email or password!");
        });
    };

    $scope.logOut = function() {
        Auth.logout().then(function() {
            $cookieStore.remove('authToken');
            $cookieStore.remove('authEmail');
            $cookieStore.remove('authId');
            $window.location.href='';
        }, function(error) {
            window.alert(error);
        });
    };


}).controller('UserListController',function($scope,$state,popupService,$window,User,Auth){

    var allUsers = User.query(function() {
        GetAllNames(); 
    });

    $scope.users = search("","","")
    $scope.names = [];

        /*Get all names for autocomplite*/
    function GetAllNames() {
        for (var i = 0; i < allUsers.length; i++) {
            $scope.names.push(allUsers[i].first_name + " " + allUsers[i].last_name)
        };
        $scope.itemsPerPage = $scope.itemsPerPage || 20;
        pageNum();
    };
    
        /*Search by params*/
    $scope.search = function(keywords, city, age) {
        search(keywords, city, age);
    };

    function search(keywords, city, age) {
        $scope.users = User.query({"keywords": keywords, "city": city, "age": age}, function() {
                $scope.currentPage = 1;
                pageNum();
        });
        return $scope.users;
    };

        /*Sort by first name*/
    $scope.SortByFirstName = function() {
        var element = document.getElementById("sortByFirstName");
        if (element.className == "") {
            SortByFirstNameForward();
            element.className = "Reverse";
        } else {
            SortByFirstNameReverse();
            element.className = "";
        };
        $scope.currentPage = 1;
    };

    function SortByFirstNameForward() {
        $scope.users.sort(function(obj1, obj2) {
            if (obj1.first_name < obj2.first_name) return -1;
            if (obj1.first_name > obj2.first_name) return 1;
            if (obj1.first_name == obj2.first_name){
                if (obj1.last_name < obj2.last_name) return -1;
                if (obj1.last_name > obj2.last_name) return 1;
                return 0;                
            };
            return 0;
        });
    }; 

    function SortByFirstNameReverse() {
        $scope.users.sort(function(obj1, obj2) {
            if (obj1.first_name > obj2.first_name) return -1;
            if (obj1.first_name < obj2.first_name) return 1;
            if (obj1.first_name == obj2.first_name){
                if (obj1.last_name > obj2.last_name) return -1;
                if (obj1.last_name < obj2.last_name) return 1;
                return 0;                
            };
            return 0;
        });
    };
        /*Sort by first name (end)*/

        /*Sort by last name*/
    $scope.SortByLastName = function() {
        var element = document.getElementById("sortByLastName");
        if (element.className == "") {
            SortByLastNameForward();
            element.className = "Reverse";
        } else {
            SortByLastNameReverse();
            element.className = "";
        };
        $scope.currentPage = 1;
    };

    function SortByLastNameForward() {
        $scope.users.sort(function(obj1, obj2) {
            if (obj1.last_name < obj2.last_name) return -1;
            if (obj1.last_name > obj2.last_name) return 1;
            if (obj1.last_name == obj2.last_name){
                if (obj1.first_name < obj2.first_name) return -1;
                if (obj1.first_name > obj2.first_name) return 1;
                return 0;                
            };
            return 0;
        });
    }; 

    function SortByLastNameReverse() {
        $scope.users.sort(function(obj1, obj2) {
            if (obj1.last_name > obj2.last_name) return -1;
            if (obj1.last_name < obj2.last_name) return 1;
            if (obj1.last_name == obj2.last_name){
                if (obj1.first_name > obj2.first_name) return -1;
                if (obj1.first_name < obj2.first_name) return 1;
                return 0;                
            };
            return 0;
        });
    };
        /*Sort by last name (end)*/

        /*Sort by age*/
    $scope.SortByAge = function() {
        var element = document.getElementById("sortByAge");
        if (element.className == "") {
            SortByAgeForward();
            element.className = "Reverse";
        } else {
            SortByAgeReverse();
            element.className = "";
        };
        $scope.currentPage = 1;
    };       

    function SortByAgeForward() {
        $scope.users.sort(function(obj1, obj2) {
            return obj1.age-obj2.age;
        });
    }; 

    function SortByAgeReverse() {
        $scope.users.sort(function(obj1, obj2) {
            return obj2.age - obj1.age;
        });
    };
        /*Sort by age (end)*/

        /* Angular Select */
    $scope.numOptions = {
        availableOptions: [
            {num: 3},
            {num: 5},
            {num: 10},
            {num: 20},
            {num: 30},
            {num: 40},
            {num: 50},
        ],
        selectedOption: {num: 20} 
    };
        /* Angular Select (end) */

        /* Pagination */
    $scope.viewby = $scope.numOptions.selectedOption.num;
    $scope.itemsPerPage = $scope.viewby;
    $scope.currentPage = 1;
    $scope.setItemsPerPage = function(num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
        pageNum();
    };
    $scope.maxSize = 5;

    $scope.firstPage = function() {
        $scope.currentPage = 1;
    };

    $scope.previousPage = function() {
        if ($scope.currentPage > 1) {
            $scope.currentPage -= 1;
        }
    };

    $scope.nextPage = function() {
        lastOfPages();
        if ($scope.currentPage < $scope.lastOfPages) {
            $scope.currentPage += 1;
        }
    };

    $scope.lastPage = function() {
        lastOfPages();
        $scope.currentPage = $scope.lastOfPages;
    };

    $scope.goToPage = function(page) {
        $scope.currentPage = page;
    };

    function lastOfPages() {
        if (($scope.users.length % $scope.itemsPerPage) !== 0) {
            $scope.lastOfPages = ($scope.users.length - ($scope.users.length % $scope.itemsPerPage) + $scope.itemsPerPage) / $scope.itemsPerPage; 
        } else {
            $scope.lastOfPages = ($scope.users.length - ($scope.users.length % $scope.itemsPerPage)) / $scope.itemsPerPage;
        }
    };

    function pageNum() {
        $scope.numPages = Math.ceil($scope.users.length / $scope.itemsPerPage);
    };
        /* Pagination (end) */

}).controller('UserViewController',function($scope,$stateParams,$state,popupService,$window,User, $cookieStore){

	$scope.isAuthenticated = function() {
    	var auth = $cookieStore.get('authToken');
        if (auth !== undefined) {
        	return true;
        } else {
        	return false;
        }
    };

	if ($scope.isAuthenticated() == false) {
		$window.location.href='';
	};

    $scope.currentUserId = function(Id) {
    	var id = Id || 0;
    	if ($cookieStore.get('authId') == id) {
    		return true;
    	} else {
    		return false;
    	}
    };

    $scope.user = User.get({id:$stateParams.id});

    $scope.deleteUser=function(user){
        if(popupService.showPopup('Really delete user?')){
            user.$delete(function(){
            	$cookieStore.remove('authToken');
	            $cookieStore.remove('authEmail');
	            $cookieStore.remove('authId');
	            $window.location.href='';
            });
        }
    }

}).controller('UserCreateController',function($scope,$state,$stateParams,User, $cookieStore, $window, Auth){

    $scope.user = new User();

    $scope.isAuthenticated = function() {
    	var auth = $cookieStore.get('authToken');
        if (auth !== undefined) {
        	return true;
        } else {
        	return false;
        }
    };

	if ($scope.isAuthenticated()) {
		$window.location.href='';
	};

    function loginUser(email, pass) {
        var credentials = {
            email: email,
            password: pass
        };
        var config = {
            headers: {
                'X-HTTP-Method-Override': 'POST'
            }
        };

        Auth.login(credentials, config).then(function(user) {
            console.log(user); // => {id: 1, ect: '...'}
            $cookieStore.put('authToken', user.token);
            $cookieStore.put('authEmail', user.email);
            $cookieStore.put('authId', user.id);
            $window.location.href='';
        });
    };

    $scope.addUser=function(){
    	var pass = $scope.user.password;
    	var email = $scope.user.email;
        $scope.user.$save(function(){
        	loginUser(email, pass);
        }, function(error) {
            $scope.errorsPresent = true;
            $scope.errors = error;
        });

    };

}).controller('UserEditController',function($scope,$state,$stateParams,User, $cookieStore, $location, $window){

	var userId = $cookieStore.get('authId');

	if (userId === undefined) {
		$window.location.href='';
	};

	if (userId != $stateParams.id) {
		$state.go('users');
	};

    $scope.updateUser = function(){
        $scope.user.$update(function(){
            $location.path('users/' + userId + '/view');
        }, function(error) {
            $scope.errorsPresent = true;
            $scope.errors = error;
        });
    };

    $scope.loadUser=function(){
        $scope.user=User.get({id:$stateParams.id});
    };

    $scope.loadUser();
});