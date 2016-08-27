/**
 * Created by tedshaffer on 6/10/16.
 */
export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function getKey(obj, keyIndex) {
    return Object.keys(obj)[keyIndex];
}

export function getFirstKey(obj) {
    return getKey(obj, 0);
}

export function getLastKey(obj) {
    const numKeys = Object.keys(obj).length;
    return getKey(obj, numKeys-1);
}

export function getShortenedFilePath(filePath, maxLength) {

    if (!filePath) return "";

    let shortenedFilePath = filePath;

    if (shortenedFilePath.length > maxLength) {

        let split = shortenedFilePath.split('/');

        if (split && split.length > 2) {
            let currentLength = split[0].length + split[split.length - 1].length + 5;
            shortenedFilePath = '/' + split[split.length - 1];
            let index = split.length - 2;
            while ((currentLength < maxLength) & (index > 0)) {
                currentLength += 1 + split[index].length;
                if (currentLength < maxLength) {
                    shortenedFilePath = "/" + split[index] + shortenedFilePath;
                }
                index--;
            }
            shortenedFilePath = split[0] + "//..." + shortenedFilePath;
        }
    }
    return shortenedFilePath;
}

