import { atom } from 'recoil';
import { fetchDataFromFirebase } from './fbase'; // Firebase에서 데이터를 가져오는 함수

export const myDataAtom = atom({
    key: 'myDataAtom',
    default: fetchDataFromFirebase(), // Firebase 데이터를 가져와서 atom 초기값으로 설정
});
