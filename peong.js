var Peong = (function() {
  var msgTimer = null,
    listEl = document.getElementById("list"),
    currentTime;

  function init() {
    currentTime = currentTime || new Date();

    if (msgTimer != null) clearInterval(msgTimer);

    document.msgForm.add.addEventListener("click", function() {
      addMsg();
    });
    listEl.addEventListener("click", function(e) {
      if (e.target.name === "increase" || e.target.name === "decrease") {
        setTime(e.target, e.target.name);
      } else if (e.target.name === "delete") {
        deleteMsg(e.target);
      }
    });

    msgTimer = setInterval(function() {
      // countTime();
    }, 1000);

    updateList();
  }

  function addMsg() {
    var msg = document.msgForm.msg.value,
      time = document.msgForm.time.value,
      curList;

    if (msg.length < 3 || isNaN(time)) {
      window.alert("메세지는 3자 이상, 시간 값을 입력해주세요!");
      return;
    }

    var msgStorage = localStorage.getItem("msg"),
      newMsg = {
        id:
          "_" +
          Math.random()
            .toString(36)
            .substr(2, 9),
        msg: msg,
        time: time
      };

    if (!msgStorage) {
      localStorage.setItem("msg", JSON.stringify([newMsg]));
    } else {
      curList = JSON.parse(msgStorage);
      localStorage.setItem("msg", JSON.stringify(curList.concat([newMsg])));
    }

    updateList();

    msg = "";
  }

  function updateList() {
    var msgList = localStorage.getItem("msg"),
      i,
      time;

    if (!msgList) {
      return;
    }

    listEl.innerHTML = "";
    msgList = JSON.parse(msgList);

    msgList.sort((a, b) => a.time > b.time);

    for (i = 0; i < msgList.length; i++) {
      target = msgList[i];
      time = target.time;

      listEl.innerHTML +=
        '<li id="' +
        target.id +
        '"><span>' +
        target.msg +
        " </span><span>남은시간 : " +
        time +
        "</span><br><select name=iTime>" +
        '<option value="3">3초</option>' +
        '<option value="5">5초</option>' +
        '<option value="*2">2배</option>' +
        '<option value="*3">3배</option>' +
        '</select><input type=button name=increase value="시간 추가">' +
        "<select name=dTime>" +
        '<option value="-3">-3초</option>' +
        '<option value="-5">-5초</option>' +
        '</select><input type=button name=decrease value="시간 감소"><input type=button name=delete value="삭제"></li>';
    }
  }

  // function deleteAlarm(target) {
  //   var targetId = target.parentNode.id,
  //     alarmList = JSON.parse(localStorage.getItem("alarm"));

  //   alarmList = alarmList.filter(function(item) {
  //     return item.id !== targetId;
  //   });

  //   localStorage.setItem("alarm", JSON.stringify(alarmList));
  //   updateAlarm();
  // }

  // function snoozeAlarm(target) {
  //   var targetId = target.parentNode.id,
  //     alarmList = JSON.parse(localStorage.getItem("alarm")),
  //     i;

  //   for (i = 0; i < alarmList.length; i++) {
  //     if (alarmList[i].id == targetId) {
  //       alarmList[i].snooze = !alarmList[i].snooze;
  //       target.style.color = alarmList[i].snooze === true ? "green" : "black";
  //       break;
  //     }
  //   }

  //   localStorage.setItem("alarm", JSON.stringify(alarmList));
  // }

  // function clearAlarm() {
  //   localStorage.removeItem("alarm");
  //   listEl.innerHTML = "";
  // }

  // function setTime() {
  //   currentTime = new Date(
  //     currentTime.getFullYear(),
  //     currentTime.getMonth(),
  //     currentTime.getDate(),
  //     document.alarmForm.sh.value,
  //     document.alarmForm.sm.value,
  //     document.alarmForm.ss.value
  //   );

  //   document.alarmForm.sh.value = "";
  //   document.alarmForm.sm.value = "";
  //   document.alarmForm.ss.value = "";
  // }

  // function countTime() {
  //   var s = currentTime.getSeconds(),
  //     m = currentTime.getMinutes(),
  //     h = currentTime.getHours(),
  //     alarmList,
  //     i,
  //     time,
  //     ah,
  //     am;

  //   s += 1;

  //   //분이 바뀔 때
  //   if (s == 60) {
  //     s = 0;
  //     m += 1;

  //     //알람 검사
  //     if (localStorage.getItem("alarm")) {
  //       alarmList = JSON.parse(localStorage.getItem("alarm"));

  //       for (i = 0; i < alarmList.length; i++) {
  //         time = alarmList[i].time;
  //         ah = Math.floor(time / 3600);
  //         am = Math.floor((time % 3600) / 60);

  //         if (m == am && h == ah) {
  //           popupAlarm(alarmList[i], ah, am);
  //         }
  //       }
  //     }
  //   }

  //   //시가 바뀔 때
  //   if (m == 60) {
  //     m = 0;
  //     h += 1;
  //   }

  //   if (currentTime && !isNaN(h) && !isNaN(m) && !isNaN(s)) {
  //     currentTime = new Date(
  //       currentTime.getFullYear(),
  //       currentTime.getMonth(),
  //       currentTime.getDate(),
  //       h,
  //       m,
  //       s
  //     );
  //   } else {
  //     currentTime = new Date();
  //   }

  //   curTimeEl.innerHTML = currentTime.toString();
  //   document.alarmForm.ch.value = currentTime.getHours();
  //   document.alarmForm.cm.value = currentTime.getMinutes();
  //   document.alarmForm.cs.value = currentTime.getSeconds();
  // }

  // function popupAlarm(itemObj, h, m) {
  //   var alarmType = "",
  //     text;

  //   if (itemObj.snooze) {
  //     return;
  //   }

  //   if (itemObj.clockMode === "일반") {
  //     alarmType = "소리";
  //   } else if (itemObj.clockMode === "진동") {
  //     alarmType = "진동";
  //   } else {
  //     if (itemObj.alarmMode === "긴급") {
  //       alarmType = "소리";
  //     } else {
  //       return;
  //     }
  //   }

  //   text = h + " : " + m + "\n " + itemObj.msg + "\n " + alarmType + "입니다!!";

  //   window.alert(text);
  // }

  return {
    init
  };
})();
