// Fix this feature to make auto-aim efficient... Or it will waste all your missiles!
var pointDistance = function (p, q) {
#BEGIN_EDITABLE#
    return 1;
#END_EDITABLE#
};

#START_OF_GOAL_FUNCTION#
var p = {x: rand(50, 370), y: rand(50, 370)};
var q = {x: rand(50, 370), y: rand(50, 370)};

console.log("controllo la presenza di errori nell'editor");
testFunction(p,q);
editor.defineFunction();

var penaltyFindTarget = function (missile, source) {
    return {x: rand(50, 370), y: rand(50, 370)};
};

if (pointDistance(p, q) !== Math.sqrt( Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2) ))  {
    console.log("La funzione non restituisce un risultato corretto");

    findTarget = penaltyFindTarget;
} else {
    console.log("La funzione e' corretta");
    findTarget = correctFindTarget;
}

#END_OF_GOAL_FUNCTION#
