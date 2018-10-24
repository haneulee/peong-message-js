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
    document.msgForm.clear.addEventListener("click", function() {
      clearMsg();
    });
    listEl.addEventListener("click", function(e) {
      if (e.target.name === "increase" || e.target.name === "decrease") {
        setTime(e.target, e.target.name);
      } else if (e.target.name === "delete") {
        deleteMsg(e.target);
      }
    });

    msgTimer = setInterval(function() {
      countTime();
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

    msgList.sort((a, b) => parseInt(a.time) < parseInt(b.time));

    for (i = 0; i < msgList.length; i++) {
      target = msgList[i];
      time = target.time;

      listEl.innerHTML +=
        '<li id="' +
        target.id +
        '"><span>' +
        target.msg +
        ' </span>남은시간 : <span id="time">' +
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

  function clearMsg() {
    localStorage.removeItem("msg");
    listEl.innerHTML = "";
  }

  function countTime() {
    var msgList = localStorage.getItem("msg"),
      newList = [],
      i, time, el, timeEl, len;

    if (!msgList) {
      return;
    }

    msgList = JSON.parse(msgList);
    len = msgList.length;

    for (i = 0; i < len; ++i) {
      el = listEl.querySelector("[id=" + msgList[i].id + "]");
      timeEl = el.querySelector("[id=time]");
      time = parseInt(msgList[i].time) - 1;

      if (time === 0) {
        el.parentNode.removeChild(el);
      } else {
        msgList[i].time = time;
        timeEl.textContent = time;
        newList.push(msgList[i]);
      }
    }

    localStorage.setItem("msg", JSON.stringify(newList));
  }

  return {
    init
  };
})();
