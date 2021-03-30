'use strict'



const module = angular.module('homePage.controllers', ['ngCookies']);
module.controller("controller", [ "$scope","$window", "$location", "service", '$cookies',
		function($scope,$window, $location,service, $cookies) {


			$scope.isLogged = false;
	        $scope.countPayment = 0;
	        //user used for sign-up
			//$scope.regUser = {};
			//user used for sign-in
			//$scope.user = {};
			//user sued for sign-up/in
			$scope.chorchainUser = { name:"", password:""};
			$scope.role = null;
			$scope.content = {};
			$scope.models = {};
			$scope.instances = {};
			$scope.hyperledgerInstances = {};
			$scope.selectedType = "";
			$scope.present = false;
			$scope.msg = null;
			$scope.contracts = {};
			$location.path();
			$scope.cookieId = null;
			$scope.searchText = "";
			$scope.modelName = "";
			$scope.myContract = {};
			$scope.selectedRoles = [];
			$scope.task = {};
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

				let paytop = document.getElementById('paymentCheckTop').checked;
				let messagetop = "";
				if(paytop == true){
					messagetop = "payment"+payCount+"()";
					payCount += 1;
				} else {
					if($scope.task.fnametop != "" && $scope.task.fnametop !=undefined){
						messagetop = $scope.task.fnametop+"(";
						for(let i in $scope.forms){
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

				let paybottom = document.getElementById('paymentCheckBottom').checked;
				let messagebottom = "";
				if(paybottom == true){
					messagebottom = "payment"+payCount+"()";
					payCount += 1;
				} else {
					if($scope.task.fnamebot != "" && $scope.task.fnamebot != undefined){
						messagebottom = $scope.task.fnamebot+"(";
						for(let i in $scope.forms2){
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
				const newParam = {};
				$scope.forms.push(newParam);
				}
			$scope.addParameter2 = function() {
				const newParam2 = {};
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
				const newUser = {};
				$scope.parametersArray.push(newUser);
				}
				$scope.removeParam = function(addr) {
					const index = $scope.parametersArray.indexOf(addr);
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
				const newUser = {};
				$scope.visibleAtFields.push(newUser);
			}
			$scope.removeField = function(addr) {
				const index = $scope.visibleAtFields.indexOf(addr);
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
				/*service.getHyperledgerInstances(model.id).then(function(response){
					$scope.hyperledgerInstances = response.data.response;
				});*/
			}

			$scope.registerUser = function(){
				service.registerUser($scope.chorchainUser).then(function(response){
					$scope.chorchainUser = { name:"", password:""};
					alert(response.data);
				});
			}

			$scope.loginUser = function(){
				service.loginUser($scope.chorchainUser).then(function (response) {
						if (!response.data) {
							$scope.chorchainUser = { name:"", password:""};
						} else {
							$scope.chorchainUser = { name:"", password:""};
							$cookies.put('UserId', response.data);
							$scope.cookieId = response.data;
							//window.location.href = 'http://virtualpros.unicam.it:8080/ChorChain/homePage.html';
							window.location.href = 'http://virtualpros.unicam.it:8080/MultiChain/homePage.html';
						}
					});
			}


			$scope.getModels = function(){
			    $scope.cookieId = $cookies.get('UserId');
				service.getModels().then(function(response){
					$scope.models = response.data;
				});
			}

			$scope.ethereumSubscribe = async function (model, instanceId, roletosub) {
                const ethAccount = await $scope.setMetamaskConnection();
				if(($scope.chorchainUser.address != "undefined") && ($scope.chorchainUser.address != null)
					&& ($scope.chorchainUser.address == ethAccount)){
                    service.subscribe(model, instanceId, roletosub, $cookies.get('UserId')).then(function(response){
                    $scope.msg = response.data;
                    $scope.getInstances(model);
                });
                }else if(($scope.chorchainUser.address != "undefined") && ($scope.chorchainUser.address != null)
					&& ($scope.chorchainUser.address != ethAccount)){
                    window.alert("WARNING! switch your metamask account to the one associated to this account")
				} else {
					await service.updateUserEthAddress(ethAccount, $cookies.get('UserId'));
					window.alert("Ethereum address associated to your account")
					const userId = $cookies.get('UserId');
					service.setUser(userId).then(function (response) {
						$scope.chorchainUser = response.data;
						service.subscribe(model, instanceId, roletosub, $cookies.get('UserId')).then(function (response) {
							$scope.msg = response.data;
							$scope.getInstances(model);
						});
					});
				}
			}

			$scope.hyperledgerSubscribe = function(model, index, instanceId,roletosub) {
				if(roletosub.includes(' ')){
					roletosub = roletosub.replace(' ', '_');
				}
				const instanceHyperledger = $scope.instances[index];
				service.newHyperledgerSubscribe(instanceHyperledger._id, roletosub, $cookies.get('UserId')).then(function (response) {
					if(response.data.response.ok == 1){
						$scope.msg =  "Subscribed successfully";
					}
					$scope.getHyperledgerInstances(model.id);
				});
			}


			$scope.getInstances = function(model){
				service.getInstances(model).then(function(response){
					$scope.model.instances = response.data;
					$scope.instances = response.data;
					$scope.present = true;
					$scope.selectedType = 'eth';
				});
			}

			$scope.getHyperledgerInstances = function(modelId){
				service.getHyperledgerInstances(modelId).then(function(response){
					$scope.instances = response.data.response;
					$scope.selectedType = 'fab';
				});
			}

			 $scope.createInstance = function(model, visibleAt){
				 const visibleAtArray = [];
				 for(let i = 0; i< visibleAt.length; i++){
					 if(visibleAt[i].name){
						 visibleAtArray.push(visibleAt[i].name);
					 }
				 }
				 if(visibleAtArray[0] == undefined){
					 visibleAtArray[0] = "null";
				 }
				 const allRoles = angular.copy(model.roles);
				 if($scope.selectedRoles.length != 0){
					 const allRoleslength = angular.copy(allRoles.length);
					 for (let i= $scope.selectedRoles.length-1; i>=0; i--) {
						//remove the role selected from the all roles array
						 const itemselected = allRoles.indexOf($scope.selectedRoles[i]);
						 allRoles.splice(itemselected, 1);
				    }
				 } else {
					 $scope.selectedRoles[0] = "null";
				 }
				 //allRoles ->
				service.createInstance(model, $cookies.get('UserId'), $scope.selectedRoles, allRoles, visibleAtArray).then(function(){
					$scope.selectedRoles = [];
					$scope.visibleAtFields = [
				        {}
				    ];
					$scope.msg = "Instance created";

					service.createHyperledgerInstance(model.id).then(function(response){
						$scope.getInstances(model);
					});
				});
			 }

			$scope.deploy = function(model, instanceId){
				service.deploy(model, instanceId, $cookies.get('UserId')).then(function(response){
					//console.log(response.data);
					sessionStorage.setItem('contract', JSON.stringify(response.data));
					//$window.location.href = 'http://193.205.92.133:8080/ChorChain/deploy.html';
					$window.location.href = 'http://virtualpros.unicam.it:8080/MultiChain/deploy.html';
				});
			}

			$scope.hyperledgerDeploy = function(idChorLedger){
			    window.alert("Please wait some minutes until the Fabric deploy is completed")
				service.hyperledgerDeploy(idChorLedger).then(function(response){
					console.log(response);
				});

			}

			$scope.getContracts = function(){
				service.getContracts($cookies.get('UserId')).then(function(response){
					$scope.contracts = response.data;
				})
			}

			$scope.getXml = function(filename){
				service.getXml(filename).then(function(response){
					$scope.model = response.data;
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
							console.log("yeee");
						});
					});*/
				});
			}

			$scope.optionalSubscribe = async function (instanceId, roletosubscribe) {
				const ethAccount = await $scope.setMetamaskConnection();
				const userId = $cookies.get('UserId');

				//$scope.user = response.data;
				service.getContractFromInstance(instanceId).then(function (response) {
					$scope.myContract = new web3.eth.Contract(JSON.parse(response.data.abi), response.data.address);

					$scope.myContract.methods.subscribe_as_participant(roletosubscribe).send({
						from: ethAccount,
						gas: 200000,
					}).then(function (receipt) {
						service.newSubscribe(instanceId, roletosubscribe, $cookies.get('UserId')).then(function (receipt) {
						});
					});
				});


			}
			$scope.addMeta = async function(){
				$window.addEventListener("load", function() {
					web3 = new Web3('https://rinkeby.infura.io/v3/080d5a8adcc244f4a289882d6063723c');
				    /* if (typeof web3 !== "undefined") {
				     web3 = new Web3(web3.currentProvider);
                        ethereum.enable();

                        let currentAccount = null;
                        const account = web3.eth.accounts[0];
                    } else {
				      console.log("No web3? You should consider trying MetaMask!");
				    }*/

					console.log(web3);
					const accounts = ethereum.request({ method: 'eth_requestAccounts' });
					const account = accounts[0];
					console.log(account);
					if (accounts[0] !== account) {
						console.log(account);
					}
				  });
			}

			$scope.setUser = function(){
				if($cookies.get('UserId') != null){
					$scope.isLogged = true;
					const userId = $cookies.get('UserId');
					service.setUser(userId).then(function(response){
						$scope.chorchainUser = response.data;
					});
				}else{
					$scope.isLogged = false;
					$scope.chorchainUser = { name:"", password:""};
				}
			}

			$scope.setMetamaskConnection = async function () {
				web3 = new Web3('https://rinkeby.infura.io/v3/080d5a8adcc244f4a289882d6063723c');
			    //let account;
                const accounts = await ethereum.request({ method: 'eth_accounts' });
                console.log(accounts[0]);
                console.log(web3.utils.toChecksumAddress(accounts[0]))
				return web3.utils.toChecksumAddress(accounts[0]);
				//return accounts[0];

                /*if (window.ethereum) {
                    window.web3 = new Web3(window.ethereum);
                    window.ethereum.enable();
                    account = await web3.eth.getAccounts();
                    return account[0];
                }*/
            }

            //$scope.setMetamaskConnection();
			//$scope.setUser();
			//$scope.addMeta();


   }]);
