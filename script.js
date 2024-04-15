// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    Timestamp,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase 구성 정보 설정
const firebaseConfig = {
    apiKey: "AIzaSyAv-qdHJTtM3PZleVXA8ZuVlGnHLYjcUJs",
    authDomain: "teampage-3217c.firebaseapp.com",
    projectId: "teampage-3217c",
    storageBucket: "teampage-3217c.appspot.com",
    messagingSenderId: "853950108531",
    appId: "1:853950108531:web:0b70afd3d3d71addc2eb06",
    measurementId: "G-B4741RFE19",
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/*******   Create  *******/
// 추가하기 버튼 클릭시
$("#postingbtn").click(async function () {
    let doc = {
        image: $("#image").val(),
        name: $("#name").val(),
        introduce: $("#introduce").val(),
        mbti: $("#mbti").val(),
        time: Timestamp.now(),
    };
    await addDoc(collection(db, "members"), doc);
    alert("저장 완료!");
    self.close();
    window.opener.location.reload();
});

// '멤버 추가' 버튼 클릭시
let popup_window;
$("#savebtn").click(async function () {
    popup_window = window.open(
        "newcard.html",
        "_blank",
        "width=500,height=500,left=200,top=200"
    );
});

// 팝업창 '닫기' 버튼 클릭시
$("#closebtn").click(async function () {
    self.close();
});

/*******   Read  *******/
let docs = await getDocs(
    //시간순 정렬해서 query로 불러오기
    query(collection(db, "members"), orderBy("time"))
);

async function readDB() {
    docs.forEach((doc) => {
        let row = doc.data();
        let image = row["image"];
        let name = row["name"];
        let introduce = row["introduce"];
        let mbti = row["mbti"];

        let temp_html = `
          <div class="col">
            <div class="card h-100">
              <img
                src="${image}"
                class="card-img-top"
                id="member-image"
              />
              <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${introduce}</p>
              </div>
              <div class="card-footer">
                <small class="text-body-secondary">${mbti}</small>
              </div>
              <div class="buttons" id="${doc.id}">
                <button class="editBtn">Edit</button>
                <button class="delBtn">Delete</button>
              </div>
            </div>
          </div>`;
        $("#card").append(temp_html);
    });
}

/*******   Initiate  *******/
function readyDoc() {
    if (document.readyState !== "loading") {
        //read saved data
        readDB();
    } else {
        document.addEventListener("DOMContentLoaded");
    }
}
readyDoc();

// 이미지 클릭시 새창으로 개인 페이지 열기
$(document).on("click", "#member-image", function () {
    window.open("member.html", "_blank", "width=500,height=500,left=200,top=200");
});

// Edit 버튼 클릭시
$(document).on("click", ".editBtn", async function () {
    let docID = this.parentElement.id;
    let docData = doc(db, "members", docID);
    let getData = await getDoc(docData);

    let openWin = window.open(
        "newcard.html",
        "_blank",
        "width=500,height=500,left=200,top=200"
    );

    console.log(openWin.document.getElementById("name"));
    console.log(getData.data()["name"]);

    openWin.onload = function () {
        openWin.document.getElementById("image").value = getData.data()["image"];
        openWin.document.getElementById("name").value = getData.data()["name"];
        openWin.document.getElementById("introduce").value = getData.data()["introduce"];
        openWin.document.getElementById("mbti").value = getData.data()["mbti"];
    }


});

// Delete 버튼 클릭시
$(document).on("click", ".delBtn", async function () {
    let docID = this.parentElement.id;
    await deleteDoc(doc(db, "members", docID));
    window.location.reload();
});
