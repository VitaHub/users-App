angular.module('usersApp.services',[]).factory('User',function($resource, $rootScope, $cookieStore){

    var token = $cookieStore.get('authToken');
    var email = $cookieStore.get('authEmail');

    return $resource('https://rails-crud-api.herokuapp.com/api/v1/users/:id', {id: '@id'}, 
    	{
    		'query': {method: 'GET', isArray: true,
                headers: { 'Authorization':  
                    'Token ' + 'token='+ token + ', email=' + email,
                    'Content-Type' :'application/json'
                }},
    		'update': {method: 'PUT',
                headers: { 'Authorization':  
                    'Token ' + 'token='+token+ ', email='+email,
                    'Content-Type' :'application/json'
                }},
            'get': {method: 'GET',
                headers: { 'Authorization':  
                    'Token ' + 'token='+token+ ', email='+email,
                    'Content-Type' :'application/json'
                }},
            'delete': {method: 'DELETE',
                headers: { 'Authorization':  
                    'Token ' + 'token='+token+ ', email='+email,
                    'Content-Type' :'application/json'
                }}
            
    	});
}).service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
});