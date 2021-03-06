
(function(){

	var Building = {};
	window.Building = Building;

	var elevators = [];	
	var numOfElevators = 3;
	var floorsPerElevator = 30;

	var elevatorSpeed = 1000; // miliseconds per floor
	var engines = [];

	var waitOnFloorTime = 3000;

	var queue = [];

	function sortNumber(a,b) {
    return a - b;
	}
	
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
			queue.push([]);
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

	// main AI
	Building.doMagic = function(){
		for(var elevator = 0; elevator < queue.length; elevator++){
			console.log('magicing elevator', elevator);
			if(queue[elevator].length !== 0){
				queue[elevator].sort(sortNumber);
				console.log(queue[elevator]);
				Building.sendToFloor(elevator, queue[elevator][0]).then(function(nowOnFloor){
					queue[elevator].shift();
					if(queue[elevator].length !== 0){
						setTimeout(function(){
							console.log('waitah')
							Building.doMagic();
						}, waitOnFloorTime);
					}
					// console.warn('elevator arrived!');
					// console.log('wait for', waitOnFloorTime);
					// (function(elevator){
					// 	console.log('initing timeout on elevator', elevator);
					// 	setTimeout(function(){
					// 		console.log('elevator', elevator);
					// 		console.log('queue', queue);
					// 		queue[elevator].shift();
					// 		if(queue[elevator].length !== 0){
					// 			Building.doMagic();
					// 		}
					// 	}, waitOnFloorTime);
					// })(elevator);
				});
			}
		}

	}

	// call an elevator (to go up or down) from a certain floor
	Building.callElevator = function(calledFromFloor){
		// console.log(elevators);
		// elevator = (typeof elevator === 'object') ? elevator : elevators[elevator];
		// elevator[elevator.indexOf(1)] = 0;
		// elevator[targetFloor] = 1;
		var elevator = 1;
		// Building.sendToFloor(elevator, calledFromFloor);
	}

	// require to go to a certain floor from inside an elevator
	Building.requireOnFloor = function(elevator, targetFloor){
		queue[elevator].push(targetFloor);
		Building.doMagic();
		// Building.sendToFloor(elevator, targetFloor);
	}

	// this fires up the engine and moves the elevator to desired floor
	Building.sendToFloor = function(elevator, targetFloor){
		return new Promise(function(resolve, reject){
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
					clearInterval(engines[elevator]);
					resolve(targetFloor);
				}
			}, elevatorSpeed);
		});
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
		Building.requireOnFloor(parseInt(floor.parent().attr('data-elevator')), parseInt(floor.attr('data-floor')));
	});

	$('#building').on('click', '.floor .call-up, .floor .call-down', function(){
		var floor = $(this).parent().attr('data-floor');
		$('.floor[data-floor="'+floor+'"]').addClass(($(this).hasClass('call-up')) ? 'calledUp' : 'calledDown');
		Building.callElevator(parseInt(floor));
	});

});