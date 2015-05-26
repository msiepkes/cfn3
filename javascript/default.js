var url = 'http://schema.cardiofitness-noord.nl/connector.php';
var versie = 1; 
var lidnr = 0; 
var databasename = 'CardioFitnessDB01';
var schema = moment();
var lessen = moment();
var tijden = moment();

function onError(err) {
    showMessage('Error processing SQL: ' + err.code);
}

function online() {
    return navigator.onLine;
}

/*
function dateAdd(date, interval, units) {
    var ret = new Date(date); //don't change original date
    switch (interval.toLowerCase()) {
        case 'year': ret.setFullYear(ret.getFullYear() + units); break;
        case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); break;
        case 'month': ret.setMonth(ret.getMonth() + units); break;
        case 'week': ret.setDate(ret.getDate() + 7 * units); break;
        case 'day': ret.setDate(ret.getDate() + units); break;
        case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
        case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
        case 'second': ret.setTime(ret.getTime() + units * 1000); break;
        default: ret = undefined; break;
    }
    return ret;
}

function dateFormat(d) {
    return d.getFullYear() + '/' + Right('0' + (d.getMonth() + 1), 2) + '/' + Right('0' + d.getDate(), 2) + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}
function sqliteDate(d) {
    return d.getFullYear() + Right('0' + (d.getMonth() + 1), 2) + Right('0' + d.getDate(), 2) + Right('0' + d.getHours(), 2) + Right('0' + d.getMinutes(), 2) + Right('0' + d.getSeconds(), 2);
}
function Right(str, n) {
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else {
        var iLen = String(str).length;
        return String(str).substring(iLen, iLen - n);
    }
}
*/


function greetingMessage(naam) {
    var currentHour = parseFloat(moment().format("HH"));
    var g = '';

    if (currentHour >= 12 && currentHour <= 18) {
        g = "Goedemiddag ";
    } else if (currentHour >= 18) {
        g = "Goedenavond ";
    } else {
        g = "Goedemorgen ";
    }

    return g + naam;
}

function showMessage(message) {
    $('<div />').addClass('alertPopupBG').appendTo($('body'));
    var div = $('<div />').addClass('alertPopup');
    $('<p />').html(message).appendTo(div);
    $('<a />').addClass('alertPopupClose').attr('href', '#').text('Sluiten').click(function(e){
        e.preventDefault();
        $('.alertPopupBG, .alertPopup').remove();
    }).appendTo(div);
    div.appendTo($('body'));
}


function exportResults() { 
    if(online()) {
        var regels = 0;
        db.transaction(function(tx) {
            tx.executeSql("SELECT COUNT(*) FROM Resultaten WHERE (Sync = 0)", [], function(tx, result) {
                regels = result.rows.item(0)['COUNT(*)'];
                if(regels > 0) { 
                    tx.executeSql("SELECT Schemaid, Oordeel FROM Resultaten WHERE (Sync = ?)", [0], function (tx, result) {
                        dataset = result.rows;
                        if(dataset.length > 0) {
                            var oefeningen = new Array();
                            for(i=0;i<dataset.length;i++) {
                                item = dataset.item(i);
											
                                oefening = new Object();
                                oefening.schemaid = item['Schemaid'];
                                oefening.oordeel = item['Oordeel']; 
                                oefeningen.push(oefening);
                            }
											
                            $.ajax({
                                type: "POST",
                                crossOrigin: true,
                                crossDomain : true, 
                                data : { action: 'setResults', lidnr: lidnr, oefeningen: JSON.stringify(oefeningen) },
                                dataType: "json",
                                url: url,
                                success: function(data) { 
                                    //db.transaction(function (tx) { tx.executeSql("DELETE FROM `Resultaten` WHERE (Datumtijd < ?)", [sqliteDate(dateAdd(new Date(), 'minute', 240)], null, onError); }); 
                                    //db.transaction(function (tx) { tx.executeSql("UPDATE `Resultaten` SET Sync=1 WHERE (Sync = ?)", [0], null, onError); }); 
                                } 
                            });
                        }
                    });
                }
            }, onError);
        });
    }
}


//moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
//var start = moment([2007, 0, 5]);
//moment().toNow();
/*
var a = moment();
var b = moment().add(1, 'seconds');
*/
//moment('2010-10-20').isSame('2010-10-20'); // true
moment.locale('nl');
//moment().locale(String);


moment().add(240, 'minutes').format("YYYYMMdd h:mm;ss")