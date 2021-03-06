// Calculate the missile speed.
var missileSpeed = function ( xDistance, yDistance ) {
#BEGIN_EDITABLE#

    var distance = Math.sqrt( Math.pow(xDistance, 2) + Math.pow(yDistance, 2) );

    var distancePerFrame = 1;
#END_EDITABLE#

	/* The speed is the ratio of stroke distance and distance traveled in each frame. */
    return distance / distancePerFrame;
};

// Constructor for the Player's Missile, which is a subclass of Missile and uses Missile's constructor
function PlayerMissile( source, endX, endY ) {
    // Anti missile battery this missile will be fired from
    var amb = antiMissileBatteries[source];

    Missile.call( this, { startX: amb.x,  startY: amb.y,
                          endX: endX,     endY: endY,
                          color: 'brown', trailColor: 'rgba(200,50,50,0.5)', explodeColor: 'rgba(255,230,200,0.5)' } );

    var xDistance = this.endX - this.startX,
        yDistance = this.endY - this.startY;
    // Determine a value to be used to scale the orthogonal directions of travel so the missiles travel at a constant speed and in the right direction
    var scale = missileSpeed(xDistance, yDistance);

    this.dx = xDistance / scale;
    this.dy = yDistance / scale;
    amb.missilesLeft--;
}
#START_OF_INIT_FUNCTION#

#END_OF_INIT_FUNCTION#
#START_OF_GOAL_FUNCTION#
console.log("controllo la presenza di errori nell'editor");
testFunction(100,100);
editor.defineFunction();

console.log("definisco la funzione corretta");
var correctMissileSpeed = function (xDistance, yDistance) {
    var distance = Math.sqrt( Math.pow(xDistance, 2) + Math.pow(yDistance, 2) );
    var distancePerFrame = SPEEDMISSILEDEFENSE;
    return distance / distancePerFrame;
};

console.log("confronto le 2 funzioni");
if (correctMissileSpeed(100,100) > missileSpeed(100,100)) {
    console.log("funzione settata ai parametri corretti");
    missileSpeed = correctMissileSpeed;
}
#END_OF_GOAL_FUNCTION#
#START_OF_SOLUTION_CODE#
missileSpeed = function ( xDistance, yDistance ) {

    var distance = Math.sqrt( Math.pow(xDistance, 2) + Math.pow(yDistance, 2) );

    var distancePerFrame = 12;

	/* The speed is the ratio of stroke distance and distance traveled in each frame. */
    return distance / distancePerFrame;
};
#END_OF_SOLUTION_CODE#
#LINE_GENERAL#
["<b>WE ARE UNDER ATTACK!</b>"," ","There's something wrong with our missiles, they are really slow and we can't stop the enemy.","We need ALL our facilities to remain intact.","<b>Fix it now</b> or we won't make it!"]
#LINE_OLDMAN#
["Missiles are slow? Someone must have messed up the speed settings. Look for it, it should be around 12 or something..."]
#LINE_AMOUNT_DEFENSE_MISSILES#
10
#LINE_AMOUNT_BONUS_MISSILES#
0
#LINE_AMOUNT_ENEMY_MISSILES#
15
#LINE_SPEED_ENEMY_MISSILES#
2
