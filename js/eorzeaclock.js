
/**
 * Options:
 * hour12: boolean
 *
 */
var eorzea_time = function( options ){
    var options = typeof options == 'object' ? options : {};
    var ratioRealToGame = 144 / 7;
    var hour12 = options.hour12 || false;

    var pub = {
        getMilliseconds: function( date ){
            date = date || new Date();
            return parseInt( date.getTime() * ratioRealToGame );
        },
        getHour: function( date ){
            var mod = hour12 ? 12 : 24;
            var hour = parseInt( pub.getMilliseconds( date ) / 3600000 ) % mod;
            return hour12 && !hour ? 12 : hour;
                
        },
        getMinute: function( date ){
            return parseInt( pub.getMilliseconds( date ) / 60000 ) % 60;
        },
        getSecond: function(){
            return parseInt( pub.getMilliseconds( date ) / 1000 ) % 60;
        },
        getMeridiem: function( date ){
            if( hour12 )
                return parseInt( pub.getMilliseconds( date ) / 3600000 )  % 24 >= 12 ? 'PM' : 'AM';
            return '';
        },
        getTimeString: function( date ){
            var minute = pub.getMinute( date );
            if( minute < 10 )
                minute = '0' + minute;
            return pub.getHour( date ) + ':' + minute + ' ' + pub.getMeridiem( date );
        }
    }
    return pub;
};

var calculateForecastTarget = function(lDate) { 
    // Thanks to Rogueadyn's SaintCoinach library for this calculation.
    // lDate is the current local time.

    var unixSeconds = parseInt(lDate.getTime() / 1000);
    // Get Eorzea hour for weather start
    var bell = unixSeconds / 175;

    // Do the magic 'cause for calculations 16:00 is 0, 00:00 is 8 and 08:00 is 16
    var increment = (bell + 8 - (bell % 8)) % 24;

    // Take Eorzea days since unix epoch
    var totalDays = unixSeconds / 4200;
    totalDays = (totalDays << 32) >>> 0; // Convert to uint

    // 0x64 = 100
    var calcBase = totalDays * 100 + increment;

    // 0xB = 11
    var step1 = (calcBase << 11) ^ calcBase;
    var step2 = (step1 >>> 8) ^ step1;

    // 0x64 = 100
    return step2 % 100;
}

var getWeather = function( strIndex ){
    var weathers = weather[strIndex].weather;
    var intRate = calculateForecastTarget( new Date() );
    var weather_name = '';
    for( var p in weathers )
        if( weathers[p].rate < intRate )
            weather_name =  weathers[p].name;
    return weather_name;
}

x = eorzea_time();
date = new Date( 2015, 09, 01, 20, 0, 0 );
console.log( x.getTimeString( date ) ) }
