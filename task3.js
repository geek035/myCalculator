/* n - котиков
 * m - вместимость миски
 * b - скушать котику, чтобы наесться (b <= m)
 * возле миски - только 1 кошка одновременно
 * r - время пополнения после миски, когда еда заканчивается
 * t - время, чтобы съесть корм котику, после чего уступают другим
 * 
 *  
*/

var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

process.stdin.on('end', () => {

    process.exit(0); 
});

 rl.on('line', function (data) {

});