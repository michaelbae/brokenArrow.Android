(function (window) {

var points;
var db;
var id;
var number = 100;
var INSERTDB = 'INSERT INTO DDMG (points, monsterkill, currentlevel) VALUES (';
	function DataBase(){
		points = 0;
		db = window.openDatabase("ddmg", "1.0", "ddmg_text", 5 * 1024*1024);
		db.transaction(populateDB, errorCB, successCB);
	}

    // Populate the database
    //
    function populateDB(tx) {
       	tx.executeSql('DROP TABLE IF EXISTS DDMG');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DDMG (points INT, monsterkill INT, currentlevel INT)');
        var insertSyntax = INSERTDB + number + ', 0, 1)';
		
        //tx.executeSql('INSERT INTO DDMG (points, monsterkill, currentlevel) VALUES (' + number + ' , 0, 1)');
    }

    // Transaction error callback
    //
    function errorCB(tx, err) {
        console.log("Error processing SQL: "+err);
    }

    // Transaction success callback
    //
    function successCB() {
        console.log("success!");
    }

    function updateStat(){
    	db.transaction(queryDB, errorCB);
    }
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM DDMG', [], querySuccess, errorCB);
    }

    // Query the success callback
    //
    function querySuccess(tx, results) {
    	var len = results.rows.length - 1;
        console.log("Returned rows = " + len);
        for (var i=0; i <= len; i++){
            console.log("Row = " + i + " ID = " + results.rows.item(i).monsterkill + " points =  " + results.rows.item(i).points);
        }
        var userPoint = results.rows.item(len).points;
        points = userPoint;
    }

    function getPoints(){
    	return points;
    }

DataBase();

window.DataBase = {
	updateStat: updateStat,
	successCB: successCB,
	errorCB: errorCB,
	data: db,
	points: getPoints
}


}(window));
