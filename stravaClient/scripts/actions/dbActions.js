/**
 * Created by tedshaffer on 9/24/16.
 */
export const SET_DB = 'SET_DB';

export function setDB(db) {
    return {
        type: SET_DB,
        db
    };
}
