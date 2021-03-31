'use strict'


var module = angular.module('homePage.controllers', ['ngCookies']);
module.controller("controller", [ "$scope","$window", "$location", "service", '$cookies',
		function($scope,$window, $location,service, $cookies) {

			$scope.isLogged = false;
	        $scope.countPayment = 0;
			$scope.regUser = {};
			$scope.user = {};
			$scope.role = null;
			$scope.content = {};
			$scope.models = {};
			$scope.instances = {};
			$scope.present = false;
			$scope.msg = null;
			$scope.contracts = {};
			$location.path();
			$scope.cookieId = null;
			//$scope.user.address = "";
			$scope.modelName = "";
			$scope.myContract = {};
			$scope.selectedRoles = [];
			$scope.task = {};
			$scope.redirect = " ";
			$scope.visibleAtFields = [
			        {}
			    ];
			$scope.parametersArray = [
		        {}
		    ];
			$scope.forms = [
			        {}
			    ];
			
			$scope.forms2 = [
		        {}
		    ];
		
			$scope.submitform = function(){
				//console.log($scope.task);
				var paytop = document.getElementById('paymentCheckTop').checked;
				var messagetop = "";
				if(paytop == true){
					messagetop = "payment"+payCount+"()";
					payCount += 1;
				} else {
					if($scope.task.fnametop != "" && $scope.task.fnametop !=undefined){
						messagetop = $scope.task.fnametop+"(";
						for(var i in $scope.forms){
							messagetop += $scope.forms[i].type + " " + $scope.forms[i].vari;

							if(i != ($scope.forms.length-1)){
								messagetop += ", ";
							}
							else{
								messagetop += ")";
							}
						}
						//messagetop = mt+"("+typet+" "+vart+")";
						//console.log(messagetop);
					}
				}

				var paybottom = document.getElementById('paymentCheckBottom').checked;
				var messagebottom = "";
				if(paybottom == true){
					messagebottom = "payment"+payCount+"()";
					payCount += 1;
				} else {
					if($scope.task.fnamebot != "" && $scope.task.fnamebot != undefined){
						messagebottom = $scope.task.fnamebot+"(";
						for(var i in $scope.forms2){
							messagebottom += $scope.forms2[i].type + " " + $scope.forms2[i].vari;

							if(i != ($scope.forms2.length-1)){
								messagebottom += ", ";
							}
							else{
								messagebottom += ")";
							}
						}
					}
				}
				testingfunction(taskid, messagetop, $scope.task.parttop, $scope.task.tname, $scope.task.partbot, messagebottom);
				paytop = false;
				paybottom = false;
				document.getElementById('paymentCheckBottom').checked = false;
				document.getElementById('paymentCheckTop').checked = false;
				$scope.removeParameters();
				$scope.task.fnamebot = "";
				$scope.task.fnametop="";
			}
			
			
			$scope.addParameter = function() {
			       var newParam = {};
			       $scope.forms.push(newParam);
				}
			$scope.addParameter2 = function() {
			       var newParam2 = {};
			       $scope.forms2.push(newParam2);
				}
			$scope.removeParameters = function(){
				$scope.forms = [
			        {}
			    ];
			
			$scope.forms2 = [
		        {}
		    ];
			}
			 //add parameters modal + message
			$scope.addParam = function() {
			       var newUser = {};
			       $scope.parametersArray.push(newUser);
				}
				$scope.removeParam = function(addr) {
			       var index = $scope.parametersArray.indexOf(addr);
			       if(index>0){
				       $scope.parametersArray.splice(index,1);
			       }
				}
				
				$scope.closeModal = function() {
					$scope.parametersArray.splice(1,2);
					}
				
				$scope.addMessage = function(messageName,messageParam,paramType) {
					   if(messageParam == null & paramType == undefined)
						   {  
						   	$scope.str = messageName;
						   	$('.djs-direct-editing-content').text($scope.str);
						   	$('.djs-direct-editing-content').focus();					   
						   	
						   }
					   else
						   {
						   $scope.str = messageName + "(" + paramType +" "+ messageParam + ")" ;
						   $('.djs-direct-editing-content').text($scope.str);
						   $('.djs-direct-editing-content').focus();
						   
						   }
					   if($('#paymentCheck').is(':checked')) {
						$scope.countPayment++;
					   	$scope.str = "payment"+$scope.countPayment+"()";
					   	$('.djs-direct-editing-content').text($scope.str);
					   	$('.djs-direct-editing-content').focus();					   
					   	
					   }
					}
			
			 //add address modal  
			$scope.addField = function() {
		       var newUser = {};
		       $scope.visibleAtFields.push(newUser);
			}
			$scope.removeField = function(addr) {
		       var index = $scope.visibleAtFields.indexOf(addr);
		       if(index>0){
			       $scope.visibleAtFields.splice(index,1);
		       }
			}
			// Toggle selection for the roles
			 $scope.toggleSelection = function toggleSelection(roleselected) {
			    var idx = $scope.selectedRoles.indexOf(roleselected);
			    // Is currently selected
			    if (idx > -1) {
			      $scope.selectedRoles.splice(idx, 1);
			    }
			    // Is newly selected
			    else {
			    	$scope.selectedRoles.push(roleselected);
			    }
			 }
			
			$scope.setModelName = function(fileName){
				$scope.modelName = fileName;
			}
			
			$scope.setModel = function(model){
				$scope.model = model;
			}
			
			$scope.registerUser = function(){
				service.registerUser($scope.regUser).then(function(response){	
					alert(response.data);
				});		
			}
			
			$scope.loginUser = function(){
					service.loginUser($scope.user).then(function (response) {
						if (!response.data) {

						} else {
							$cookies.put('UserId', response.data);
							$scope.cookieId = response.data;
							window.location.href = $scope.redirect + 'homePage.html';
						}

					});
			}

			
			$scope.getModels = function(){
			    $scope.cookieId = $cookies.get('UserId');
				service.getModels().then(function(response){
					$scope.models = response.data;
					//console.log("Models: ");
					//console.log($scope.models);
				});
			}
			
			$scope.subscribe = function(model, instanceId,roletosub){
				//console.log(instanceId);
				service.subscribe(model, instanceId, roletosub, $cookies.get('UserId')).then(function(response){
					$scope.msg = response.data;
					service.getInstances(model).then(function(response){
						//console.log(response);
						$scope.instances = response.data;
						$scope.present = true;
						$scope.getInstances(model);
					});
				});
			}
			
			
			$scope.getInstances = function(model){
				service.getInstances(model).then(function(response){
					$scope.model.instances = response.data;
					//console.log(response.data);
					$scope.present = true;
				});
			}
			
			 $scope.createInstance = function(model, visibleAt){
				 //console.log(visibleAt);
				 var visibleAtArray = [];
				 for(var i = 0; i< visibleAt.length; i++){
					 if(visibleAt[i].address){
						 visibleAtArray.push(visibleAt[i].address);
					 }
				 }
				 if(visibleAtArray[0] == undefined){
					 visibleAtArray[0] = "null";
				 }
				 var allRoles = angular.copy(model.roles);
				 if($scope.selectedRoles.length != 0){
					var allRoleslength = angular.copy(allRoles.length);
					for (var i= $scope.selectedRoles.length-1; i>=0; i--) {
						//remove the role selected from the all roles array
						var itemselected = allRoles.indexOf($scope.selectedRoles[i])
						allRoles.splice(itemselected, 1);
				    }
				 } else {
					 $scope.selectedRoles[0] = "null";
				 }		
				service.createInstance(model, $cookies.get('UserId'), $scope.selectedRoles, allRoles, visibleAtArray).then(function(){
					$scope.selectedRoles = [];
					$scope.visibleAtFields = [
				        {}
				    ];
					$scope.msg = "Instance created";
					$scope.getInstances(model);
				});
			 }
			
			$scope.deploy = function(model, instanceId){
				service.deploy(model, instanceId, $cookies.get('UserId')).then(function(response){
					//console.log(response.data);
					sessionStorage.setItem('contract', JSON.stringify(response.data));
					$window.location.href = $scope.redirect + 'deploy.html';
				});
			}
			
			$scope.getContracts = function(){
				//console.log("COOKIE: " + $cookies.get('UserId'));
				service.getContracts($cookies.get('UserId')).then(function(response){
					//console.log(response.data);
					$scope.contracts = response.data;
				})
			}
			
			$scope.getXml = function(filename){
				service.getXml(filename).then(function(response){
					$scope.model = response.data;
					//console.log($scope.model);
				});
			}
			
			$scope.getContractFromInstance = function(instanceId, role){
					
				
				service.getContractFromInstance(instanceId).then(function(response){
					//console.log(response.data.abi);
					//console.log(response.data.address);
				//	$scope.myContract = new web3.eth.Contract(JSON.parse(response.data.abi), response.data.address);
					
					service.newSubscribe(instanceId, user.role, $cookies.get('UserId')).then(function(receipt){
					});
				/*	$scope.myContract.methods.subscribe_as_participant($scope.user.role).send({
						from : $scope.user.address,
						gas: 200000,
					}).then(function(receipt){
						console.log(receipt);
						service.newSubscribe(instanceId, user.role, $cookies.get('UserId')).then(function(receipt){

						});
					});*/
				});
			}
			
			$scope.optionalSubscribe = function(instanceId, roletosubscribe){
				var userId = $cookies.get('UserId');
				
					//$scope.user = response.data;
					service.getContractFromInstance(instanceId).then(function(response){
						$scope.myContract = new web3.eth.Contract(JSON.parse(response.data.abi), response.data.address);
					
						$scope.myContract.methods.subscribe_as_participant(roletosubscribe).send({
							from : $scope.user.address,
							gas: 200000,
						}).then(function(receipt){
							service.newSubscribe(instanceId, roletosubscribe, $cookies.get('UserId')).then(function(receipt){
							});
						});
					});
			
				
			}
			$scope.addMeta = function(){
				$window.addEventListener("load", function() {
				    if (typeof web3 !== "undefined") {
				     web3 = new Web3(web3.currentProvider);
				     //console.log(web3);
				      //web3.eth.getAccounts().then(console.log);
				    } else {
				      console.log("No web3? You should consider trying MetaMask!");
				    }

				  });
			}
			
			$scope.setUser = function(){
				if($cookies.get('UserId') != null){
					$scope.isLogged = true;
					var userId = $cookies.get('UserId');
					service.setUser(userId).then(function(response){
						$scope.user = response.data;
					});
				}else{
					$scope.isLogged = false;
				}
			}

			$scope.setOs = function(flag){
				if (flag==1){
					$scope.redirect = "http://localhost:8080/ChorChain_war_exploded/"
				} else if(flag==2){
					$scope.redirect = "http://virtualpros.unicam.it:8080/ChorChain/"
				}
			}
			
			//$scope.setUser();
			$scope.addMeta();
			$scope.setOs(1);
			
			
   }]);
