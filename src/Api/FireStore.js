import { collection, getDocs } from "firebase/firestore";
import { dbService } from "../fbase";

// Firebase fireStore User 데이터 조회 코드
export const fetchUsers = async () => {
  const usersRef = collection(dbService, "users");
  const querySnapshot = await getDocs(usersRef);
  const usersData = [];

  querySnapshot.forEach((doc) => {
    usersData.push(doc.data());
  });

  return usersData;
};
