angular.module('usersApp',['ui.router','ngResource','usersApp.controllers','usersApp.services', 'ui.bootstrap', 'Devise', 'ngCookies']);

angular.module('usersApp').config(function($stateProvider,$httpProvider, AuthProvider ){
    AuthProvider.loginPath('https://rails-crud-api.herokuapp.com/api/v1/sessions');
    AuthProvider.loginMethod('POST');
    AuthProvider.logoutPath('');
    AuthProvider.logoutMethod('GET');
    $stateProvider.state('users',{
        url:'/users',
        templateUrl:'partials/users.html',
    }).state('viewUser',{
       url:'/users/:id/view',
       templateUrl:'partials/user-view.html',
       controller:'UserViewController'
    }).state('newUser',{
        url:'/users/new',
        templateUrl:'partials/user-add.html',
        controller:'UserCreateController'
    }).state('editUser',{
        url:'/users/:id/edit',
        templateUrl:'partials/user-edit.html',
        controller:'UserEditController'
    });
}).run(function($state){
    $state.go('users');
});