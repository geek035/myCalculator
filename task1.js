/* Ввод данных:
 * 1 строка: массив чисел nums1, отсортированный в порядке неубывания,
 *      числа вводить через пробел, массив заканчивается нулями,
 *      количество которых равно длине массива nums2
 * 
 * 2 строка: m - количество элементво в nums1 (без учета нулей в конце)
 * 
 * 3 строка: массив чисел nums2, отсортированный в порядке неубывания,
 *      числа вводить через пробел.
 * 
 * 4 строка: n - количетсво элеметов в num2
 * Пример ввода данных:
 *      1 2 3 0 0 0
 *      3
 *      2 5 6
 *      3
*/

var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var inputData = []

var merge = function(nums1, m, nums2, n) {
    if (m < 1) {
        for (let j = 0; j < n; j++) {
            nums1[j] = nums2[j];
        }

        return;
    } else if (n == 0) {
        return;
    } else {
        let saveNums = [],
            i = 0, j = 0;
        
        for (; i < m; i++) {
            let temp = saveNums.pop();
            if (temp != undefined) {
                saveNums.unshift(nums1[i]);
                nums1[i] = temp;
            }

            if (nums1[i] > nums2[j]) {
                saveNums.push(nums1[i]);
                nums1[i] = nums2[j];
                j++;
            }
        }

        while (saveNums.length > 0) {
            nums1[i] = saveNums.pop();

            if (j < n && nums1[i] > nums2[j]) {
                saveNums.push(nums1[i]);
                nums1[i] = nums2[j];
                j++;
            }
            i++;
        }

        for (; j < n; j++) {
            nums1[i] = nums2[j];
            i++;
        }
    }
}

process.stdin.on('end', () => {
    let nums1 = inputData[0].split(" ").map(e => +e),
        m = +inputData[1],
        nums2 = inputData[2].split(" ").map(e => +e),
        n = +inputData[3];

    if (m < 0 || n < 0) {
        console.log("input error: length below zero");
        process.exit(0);
    } else if (nums1.length != m + n) {
        console.log("input error: wrong nums1 length");
        process.exit(0);
    }

    merge(nums1, m, nums2, n);
    console.log(nums1);

    process.exit(0); 
});

 rl.on('line', function (data) {
    inputData.push(data);
});