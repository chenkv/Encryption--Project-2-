var data
var key
var substitutionBox = [
    [0b0010, 0b1100, 0b0100, 0b0001, 0b0111, 0b1010, 0b1011, 0b0110, 0b1000, 0b0101, 0b0011, 0b1111, 0b1101, 0b0000, 0b1110, 0b1001],
    [0b1110, 0b1011, 0b0010, 0b1100, 0b0100, 0b0111, 0b1101, 0b0001, 0b0101, 0b0000, 0b1111, 0b1010, 0b0011, 0b1001, 0b1000, 0b0110],
    [0b0100, 0b0010, 0b0001, 0b1011, 0b1010, 0b1101, 0b0111, 0b1000, 0b1111, 0b1001, 0b1100, 0b0101, 0b0110, 0b0011, 0b0000, 0b1110],
    [0b1011, 0b1000, 0b1100, 0b0111, 0b0001, 0b1110, 0b0010, 0b1101, 0b0110, 0b1111, 0b0000, 0b1001, 0b1010, 0b0100, 0b0101, 0b0011]
];

class Encryptor {
    constructor() {
        data = "";
        key = "";
    }

    randomKey() {
        var key = "";
        
        for (var i = 0; i < 24; i++) {
            var rand = Math.floor(Math.random() * (126 - 33 + 1)) + 33;
            key += String.fromCharCode(rand);
        }

        return key;
    }

    encryptData(string, k) {
        data = string;
        key = k;
        
        var size = Math.ceil(data.value.length / 4);
        var pos = 0;
        var array = [ ];

        for(var i = 0; i < 4; i++) {
            array[i] = [ ];
            for(var j = 0; j < size; j++) {
                if (pos < data.value.length) {
                    array[i][j] = data.value.charAt(pos);
                    pos++;
                } else {
                    array[i][j] = "5";
                }
            }
        }

        array = this.subBytes(array);
        array = this.shiftRows(array);
        array = this.shiftColumns(array);
        array = this.addRoundKey(array, key);

        var result = "";
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array[i].length; j++) {
                result += array[i][j];
            }
        }

        return result;
    }

    subBytes(arr) {
        for (var row in arr) {
            for (var col in row) {
                var byte = arr[row][col].charCodeAt(0);
                var middle = (byte & 60) >> 2;
                var left = byte >> 6;
                var right = byte & 3;
                arr[row][col] = String.fromCharCode((substitutionBox[left][middle] << 4) + substitutionBox[right][middle])
            }
        }

        return arr;
    }

    shiftRows(arr) {      
        for (var i = 0; i < arr.length; i++) {
            for (var g = 1; g <= i; g++) {
                arr[i].push(arr[i].shift());
            }
        }

        return arr;
    }

    shiftColumns(arr) {
        for (var i = 0; i < arr.length; i++) {
            for (var g = 0; g <= i; g++) {
                arr.push(arr.shift());
            }
        }

        return arr;
    }

    addRoundKey(arr, k) {
        var encryptionKey = []
        for(var i = 0; i < k.value.length; i++) {
            encryptionKey[i] = k.value.charAt(i);
        }
        var position = 0;

        for (var row in arr) {
            for (var col in row) {
                var byte = arr[row][col].charCodeAt(0);
                var keyByte;
                if (position < encryptionKey.length) {
                    keyByte = encryptionKey[position].charCodeAt(0);
                    position++;
                } else {
                    position = 0;
                    keyByte = encryptionKey[position].charCodeAt(0);
                }
                arr[row][col] = String.fromCharCode(byte + keyByte);
            }
        }

        return arr;
    }
}