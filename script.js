// main.js
var app = angular.module('myApp', []);

function House(){
    var that = this;
    this.id = 0;
    this.owned = true;
    this.value = 50000;
    this.rent = function(){
        return that.value * 0.01;
    };
    this.upgradeCost = function(){
        return that.value * 0.10 ;
    };
    this.upgradeBenefit = function(){
        return that.value * 0.15 ;
    };
}

app.controller('MainCtrl', function($scope, $timeout) {
    $scope.character = {
        cash : 100000,
        properties: 0,
        netWorth: function(){
            return $scope.character.cash + $scope.character.properties;
        }
    };

    $scope.settings ={
        upgradeCostPct: 0.10,
        upgradeBenefitPct: 0.15,
        houseDepreciationPct : 0.001,
        rentAsPctOfValue: 0.01,
        monthRateInMs: 1000
    };

    $scope.houses =[];
    $scope.newHouse = new House();

    $scope.buyHouse = function(house, character){
        house.owned = true;
        character.cash -= house.value;
        character.properties += house.value;
    };

    $scope.sellHouse = function(house, character){
        house.owned = false;
        character.properties -= house.value;
        character.cash += house.value;
    };

    $scope.buildHouse = function(houses, character){
        var house = new House();
        house.id = houses.length + 1;

        houses.push(house);
        character.cash -= house.value;
        character.properties += house.value;
    };

    $scope.exceedCashCheck = function(cost, cashBalance){
        return cost > cashBalance;
    };

    $scope.buyUpgrade = function(house, character, settings){
        character.cash -= house.upgradeCost();
        character.properties += house.upgradeBenefit();
        house.value += house.upgradeBenefit();
    };

    $scope.updateValues = function(houses, character, settings){
        $.each(houses, function(){
            var changeInValue = this.value * settings.houseDepreciationPct;
            if(this.owned){
                this.value -= changeInValue;

                character.properties -= changeInValue;
                character.cash += this.rent();
            }
            else{
                this.value += changeInValue;
            }
        });

        myTimeout = $timeout(
            function(){
                $scope.updateValues(houses, character, settings);
            }, $scope.settings.monthRateInMs
        );
    };

    var myTimeout;

    $scope.start = function(houses, character, settings){
        myTimeout = $timeout(
            function(){
                $scope.updateValues(houses, character, settings);
            }, $scope.settings.monthRateInMs
        );
    };

    $scope.stop = function(){
        $timeout.cancel(myTimeout);
    };
});