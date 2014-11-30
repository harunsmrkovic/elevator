
(function(){

	var Building = {};
	window.Building = Building;

	var elevators = [];	
	var numOfElevators = 3;
	var floorsPerElevator = 30;

	var elevatorSpeed = 1000; // miliseconds per floor
	var engines = [];
	
	Building.buildBuilding = function(){
		for(var ei = 0; ei < numOfElevators; ei++){
			$('#building').append('<div class="elevator" data-elevator="'+ei+'"></div>');
			var elevator = [];
			for(fi = floorsPerElevator; fi >= 0; fi--){
				// 1 represents the floor elevator is currently on
				if(fi === floorsPerElevator)	elevator.push(1);
				// 0 represents floor without elevator
				else 					elevator.push(0);

				// drawing elevator shaft
				$('#building .elevator[data-elevator="'+ei+'"').append('<div class="floor" data-floor="'+fi+'"><i class="fa fa-chevron-up call-up"></i> <span>'+fi+'</span> <i class="fa fa-chevron-down call-down"></i></div>');
			}
			elevators.push(elevator);
		}
		$('#building').append('<div id="basement"></div>');
	}

	Building.renderElevators = function(){
		$('#building .floor').removeClass('hasElevator');
		for(var ei = 0; ei < elevators.length; ei++){
			var floorWithElevator = elevators[ei].indexOf(1);
			$('#building .elevator[data-elevator="'+ei+'"] .floor[data-floor="'+floorWithElevator+'"]').addClass('hasElevator');
		}
	}

	// this function will add floor that elevator has to go to to queue
	Building.callElevator = function(elevator, targetFloor){
		// console.log(elevators);
		// elevator = (typeof elevator === 'object') ? elevator : elevators[elevator];
		// elevator[elevator.indexOf(1)] = 0;
		// elevator[targetFloor] = 1;
		Building.sendToFloor(elevator, targetFloor);
	}

	Building.sendToFloor = function(elevator, targetFloor){
		clearInterval(engines[elevator]);
		engines[elevator] = setInterval(function(){
			if(Building.getCurrentFloor(elevator) !== targetFloor){
				if(Building.getCurrentFloor(elevator) - targetFloor <= 0){
					Building.moveFloorUp(elevator);
				}
				else {
					Building.moveFloorDown(elevator);
				}
			}
			else {
				// $('#building .elevator[data-elevator="'+elevator+'"] .floor[data-floor="'+targetFloor+'"]').removeClass('calledElevator');
				clearInterval(engines[elevator]);
			}
		}, elevatorSpeed);
	}

	Building.moveFloorDown = function(elevator){
		elevator = (typeof elevator === 'object') ? elevator : elevators[elevator];
		var currentFloor = elevator.indexOf(1);
		elevator[currentFloor-1] = 1;
		elevator[currentFloor] = 0;
	}

	Building.moveFloorUp = function(elevator){
		elevator = (typeof elevator === 'object') ? elevator : elevators[elevator];
		var currentFloor = Building.getCurrentFloor(elevator);
		elevator[currentFloor+1] = 1;
		elevator[currentFloor] = 0;
	}

	Building.getCurrentFloor = function(elevator){
		elevator = (typeof elevator === 'object') ? elevator : elevators[elevator];
		return elevator.indexOf(1);
	}

})();

// jquery listeners
$(document).ready(function(){

	Building.buildBuilding();

	var renderingInterval = setInterval(function(){
		Building.renderElevators();
	}, 100);

	$('#building').on('click', '.floor span', function(){
		var floor = $(this).parent();
		floor.addClass('calledFromElevator');
		Building.callElevator(parseInt(floor.parent().attr('data-elevator')), parseInt(floor.attr('data-floor')));
	});

	$('#building').on('click', '.floor .call-up', function(){
		var floor = $(this).parent();
		floor.addClass('calledUp');
		Building.callElevator(parseInt(floor.parent().attr('data-elevator')), parseInt(floor.attr('data-floor')));
	});

	$('#building').on('click', '.floor .call-down', function(){
		var floor = $(this).parent();
		floor.addClass('calledDown');
		Building.callElevator(parseInt(floor.parent().attr('data-elevator')), parseInt(floor.attr('data-floor')));
	});

});