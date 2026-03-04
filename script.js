
/* ===== CORE FUNCTIONS ===== */
      let currentMainOTP = "";

      function showNotification(message, color = "#ff4757") {
        let box = document.getElementById("notification");
        box.innerHTML = message;
        box.style.background = color;
        box.style.display = "block";
        setTimeout(() => {
          box.style.display = "none";
        }, 3000);
      }

      function showPopup(title, message, onConfirm, onCancel, customButtons) {
        const overlay = document.createElement("div");
        overlay.className = "popup-overlay";
        overlay.id = "popupOverlay";
        let buttonsHtml =
          customButtons ||
          `<button class="popup-btn primary" id="popupConfirmBtn">OK</button>${onCancel ? '<button class="popup-btn secondary" id="popupCancelBtn">Cancel</button>' : ""}`;
        overlay.innerHTML = `<div class="popup-box"><i class="fas fa-info-circle"></i><h3>${title}</h3><p>${message}</p><div>${buttonsHtml}</div></div>`;
        document.body.appendChild(overlay);
        if (!customButtons) {
          document.getElementById("popupConfirmBtn").onclick = () => {
            document.body.removeChild(overlay);
            if (onConfirm) onConfirm();
          };
          if (onCancel)
            document.getElementById("popupCancelBtn").onclick = () => {
              document.body.removeChild(overlay);
              if (onCancel) onCancel();
            };
        }
      }

      function refreshLogin() {
        document.getElementById("username").value = "";
        document.getElementById("village").value = "";
        document.getElementById("emailId").value = "";
        document.getElementById("mainOtpSection").style.display = "none";
        document.getElementById("getOtpBtn").disabled = false;
        document.getElementById("getOtpBtn").innerText = "Get OTP";
        showNotification("Form Refreshed", "#1e90ff");
      }

      /* ===== OTP LOGIC FUNCTIONS ===== */
      function generateOTP() {
        return Math.floor(1000 + Math.random() * 9000).toString();
      } // 4 Digit

      function moveToNext(current, nextFieldID) {
        if (current.value.length >= 1) {
          const next = document.getElementById(nextFieldID);
          if (next) next.focus();
        }
      }

      // --- Main Login OTP Logic (4 Digits) ---
      function sendMainOTP() {
        let username = document.getElementById("username").value.trim();
        let village = document
          .getElementById("village")
          .value.trim()
          .toLowerCase();
        let email = document.getElementById("emailId").value.trim();

        if (!username) {
          showNotification("Please fill user name");
          return;
        }
        let validVillages = [
          "kankradi",
          "KANKRADI",
          "DONGRIPADA",
          "SHIVANI",
          "shivani",
          "Shivani",
          "Atul",
          "atul",
          "ATUL",
          "Narpad",
          "narpad",
          "NARPAD",
          "dongripada",
          "lashkari",
          "laskari",
          "kankradi nandhare",
          "kankradi dongripada",
        ];
        if (!village || !validVillages.includes(village)) {
          showNotification("Wrong village name");
          return;
        }
        if (!email || !email.includes("@")) {
          showNotification("Please enter a valid Email ID");
          return;
        }

        const btn = document.getElementById("getOtpBtn");
        btn.disabled = true;
        btn.innerText = "Sending...";

        setTimeout(() => {
          currentMainOTP = generateOTP();
          showPopup(
            "OTP Sent",
            `An OTP has been sent to <b>${email}</b>.<br>Your OTP is: <h2 style='color:#1abc9c;'>${currentMainOTP}</h2>`,
          );
          document.getElementById("mainOtpSection").style.display = "block";
          document.getElementById("mainOtp1").focus();
          btn.innerText = "Resend OTP";
          btn.disabled = false;
        }, 2000);
      }

      function verifyMainOTP() {
        let otp = "";
        for (let i = 1; i <= 4; i++) {
          otp += document.getElementById("mainOtp" + i).value;
        }
        if (otp.length < 4) {
          showNotification("Please enter complete OTP");
          return;
        }
        if (otp === currentMainOTP) {
          showNotification("Login Successful", "#2ed573");
          setTimeout(() => {
            document.getElementById("loginPage").style.display = "none";
            document.getElementById("mainPage").style.display = "block";
            document.body.style.display = "block";
            checkUserSession();
            showHome();
          }, 800);
        } else {
          showNotification("Wrong OTP");
        }
      }

      // --- Login with Code Logic (6 Digits, Hidden Input) ---
      function showCodeLoginScreen() {
        document.getElementById("mainLoginBox").classList.add("hidden");
        document.getElementById("codeLoginBox").classList.remove("hidden");
        for (let i = 1; i <= 6; i++)
          document.getElementById("codeOtp" + i).value = "";
        document.getElementById("codeOtp1").focus();
      }

      function hideCodeLoginScreen() {
        document.getElementById("mainLoginBox").classList.remove("hidden");
        document.getElementById("codeLoginBox").classList.add("hidden");
      }

      function verifyCodeOTP() {
        let code = "";
        for (let i = 1; i <= 6; i++) {
          code += document.getElementById("codeOtp" + i).value;
        }
        if (code.length < 6) {
          showNotification("Please enter complete Code");
          return;
        }

        // Password is "a2024s"
        if (code === "A2024S","rupesh","Rupesh","Kunal.","kunal.") {
          showNotification("Login Successful", "#2ed573");
          setTimeout(() => {
            document.getElementById("loginPage").style.display = "none";
            document.getElementById("mainPage").style.display = "block";
            document.body.style.display = "block";
            checkUserSession();
            showHome();
          }, 800);
        } else {
          showNotification("Wrong Code");
          for (let i = 1; i <= 6; i++)
            document.getElementById("codeOtp" + i).value = "";
          document.getElementById("codeOtp1").focus();
        }
      }

      /* Backspace handling for OTP inputs */
      document.addEventListener("keydown", function (e) {
        const active = document.activeElement;
        if (
          e.key === "Backspace" &&
          active.classList.contains("code-input") &&
          active.value.length === 0
        ) {
          const currentId = active.id;
          const match = currentId.match(/\d+$/);
          if (match) {
            const index = parseInt(match[0]);
            if (index > 1) {
              const prevId = currentId.replace(/\d+$/, (index - 1).toString());
              const prevElem = document.getElementById(prevId);
              if (prevElem) prevElem.focus();
            }
          }
        }
      });

      /* ===== USER SESSION MANAGEMENT ===== */
      function checkUserSession() {
        let isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
        if (isUserLoggedIn === "true") showRestrictedButtons();
        else hideRestrictedButtons();
      }
      function showRestrictedButtons() {
        document.getElementById("restrictedSection").style.display = "contents";
        document.getElementById("sidebarLoginBtn").innerHTML =
          '<i class="fas fa-user-check"></i> Logged In';
        document.getElementById("sidebarLoginBtn").onclick = null;
        document.getElementById("sidebarLogoutBtn").style.display = "flex";
      }
      function hideRestrictedButtons() {
        document.getElementById("restrictedSection").style.display = "none";
        document.getElementById("sidebarLoginBtn").innerHTML =
          '<i class="fas fa-sign-in-alt"></i> Login';
        document.getElementById("sidebarLoginBtn").onclick = showUserLoginForm;
        document.getElementById("sidebarLogoutBtn").style.display = "none";
      }
      function showUserLoginForm() {
        stopGames();
        document.getElementById("contentArea").innerHTML =
          `<div class="sticky-header"><h2 class="big-title">User Login</h2></div><div class="form-container fade-in" style="max-width: 400px; margin: 0 auto;"><p style="color:#666; text-align:center; margin-bottom:15px;">Login to see more option or data</p><div class="dynamic-input"><input type="text" id="userLoginName" placeholder="User Name"></div><div class="dynamic-input"><input type="email" id="userLoginEmail" placeholder="Email ID"></div><div class="dynamic-input"><input type="password" id="userLoginPass" placeholder="Enter Password"></div><button onclick="validateUserLogin()">Submit</button></div>`;
      }
      function validateUserLogin() {
        let name = document.getElementById("userLoginName").value.trim();
        let email = document.getElementById("userLoginEmail").value.trim();
        let pass = document.getElementById("userLoginPass").value.trim();
        if (!name || !email || !pass) {
          showNotification("Please fill all information");
          return;
        }
        if (pass !== "atulsvedga07092024","kunalvedga21042004") {
          showNotification("Wrong password");
          return;
        }
        localStorage.setItem("isUserLoggedIn", "true");
        showNotification("Login Successful!", "#2ed573");
        showRestrictedButtons();
        showHome();
      }
      function logoutUser() {
        localStorage.removeItem("isUserLoggedIn");
        showNotification("Logged Out Successfully", "#3498db");
        hideRestrictedButtons();
        showHome();
      }

      /* ===== HOME & PROFILE ===== */
      const profiles = {
        Aamdar: {
          title: "आमदार - Vinod Nikole",
          img: "nikole.jpg",
          info: "Vinod Bhiva Nikole is an Indian politician and Aamdar (MLA) from the Dahanu Assembly constituency in Maharashtra. He represents the Communist Party of India (Marxist) (CPI-M) and was first elected to the Maharashtra Legislative Assembly in 2019 and re-elected in 2024. Coming from a poor Adivasi (Scheduled Tribe) family in Palghar district, he has a grassroots background and was previously known for running a small vada pav stall before entering full-time politics. As an MLA, he is recognized for raising issues related to tribal welfare, farmers’ rights, healthcare, infrastructure, and local development in his constituency.",
        },
        Sarpanch: {
          title: "सरपंच - Rupali Kokera",
          img: "istockphoto-522855255-612x612.jpg",
          info: "Rupali Kokera is a sarpanch of kankradi grampanchayat.",
        },
        Upsarpanch: {
          title: "उपसरपंच - Rupesh Fesharda",
          img: "Media (1).jpg",
          info: "Rupesh Fesharda is the Upsarpanch of Kankradi Grampanchayat and plays an important role in supporting the Sarpanch and serving the local community.",
        },
      };
      function showProfile(key) {
        stopGames();
        const p = profiles[key];
        document.getElementById("contentArea").innerHTML =
          `<div class="profile-header fade-in"><img src="${p.img}" alt="${p.title}"><h2>${p.title}</h2></div><div class="data-card slide-in"><h3 style="margin-top:0; color:#2c3e50;">Information</h3><p style="font-size:16px; color:#555; line-height:1.6;">${p.info}</p><button class="back-btn" onclick="showHome()"><i class="fas fa-arrow-left"></i> Go Back</button></div>`;
      }
      let homePopupShown = false;
      function showHome() {
        stopGames();
        let allFalas = [
          "Gav dev Falni",
          "Mahit Fala",
          "Ganpati Vargani",
          "Navratri Vargani",
          "Holi Vargani",
        ];
        let grandTotal = 0;
        let entryCount = 0;
        let breakdownHtml = "";
        allFalas.forEach((name) => {
          let data = JSON.parse(localStorage.getItem(name)) || [];
          let typeTotal = 0;
          data.forEach((item) => {
            if (item.fala) {
              typeTotal += Number(item.fala);
              entryCount++;
            }
          });
          grandTotal += typeTotal;
          breakdownHtml += `<div class="summary-row"><span>${name}</span><span>₹ ${typeTotal.toLocaleString()}</span></div>`;
        });
        if (!homePopupShown) {
          showPopup(
            "Welcome!",
            "Login this website to see more option and use this web application",
            () => {
              homePopupShown = true;
            },
          );
        }
        document.getElementById("contentArea").innerHTML =
          `<div class="sticky-header"><h2 class="big-title" style="margin-top:15px;">Grampanchayat - Kankradi</h2><div style="text-align:center; position:relative; max-width:500px; margin:0 auto;"><input type="text" id="homeSearchInput" placeholder="Search name, year..." onkeyup="searchHomeData()" style="width:100%; padding:15px 25px; border-radius:50px; border:none; box-shadow:0 4px 20px rgba(0,0,0,0.08); outline:none; font-size:16px;"></div></div><div class="summary-box slide-in"><h2><i class="fas fa-hand-holding-usd"></i> Total Falni Collection</h2><div class="summary-details">${breakdownHtml}</div><div class="amount">Total: ₹ ${grandTotal.toLocaleString()}</div><div class="sub-info">From ${entryCount} entries across all categories</div></div><div id="homeSearchResults"></div>
        <div class="card card-animate" style="background-image:url('red flage.jpg');" onclick="showProfile('Aamdar')">
        <div class="card-content"><h3>आमदार</h3><p>Vinod Nikole ( विनोद निकोले )</p></div><img src="nikole.jpg"></div>

<div class="card card-animate" style="background-image:url('Black and Ivory Modern Name YouTube Channel Art (1).png');" onclick="showProfile('Sarpanch')">
        <div class="card-content"><h3>सरपंच</h3><p>Rupali Kokera ( रुपाली कोकरे )</p></div><img src="istockphoto-522855255-612x612.jpg"></div>

<div class="card card-animate" style="background-image:url('Black and Ivory Modern Name YouTube Channel Art.png');" onclick="showProfile('Upsarpanch')">
        <div class="card-content"><h3>उपसरपंच</h3><p>Rupesh Fesharda ( रुपेश फेसरडा )</p></div><img src="Media (1).jpg"></div>

<div class="card card-animate" style="background-image:url('Black and Ivory Modern Name YouTube Channel Art (4).png');">
        <div class="card-content"><h3>कार्यकर्ता</h3><p>Pending</p></div><img src="istockphoto-522855255-612x612.jpg"></div>

        <div class="card card-animate" style="background-image:url('Black and Ivory Modern Name YouTube Channel Art (4).png');">
        <div class="card-content"><h3>कार्यकर्ता</h3><p>Pending</p></div><img src="istockphoto-522855255-612x612.jpg"></div>

        <div class="card card-animate" style="background-image:url('Black and Ivory Modern Name YouTube Channel Art (4).png');">
        <div class="card-content"><h3>कार्यकर्ता</h3><p>Pending</p></div><img src="istockphoto-522855255-612x612.jpg"></div>

        <div class="card card-animate" style="background-image:url('Black and Ivory Modern Name YouTube Channel Art (4).png');">
        <div class="card-content"><h3>कार्यकर्ता</h3><p>Pending</p></div><img src="istockphoto-522855255-612x612.jpg"></div>





      </div>`;
      }
      function searchHomeData() {
        let input = document
          .getElementById("homeSearchInput")
          .value.toLowerCase();
        let resultBox = document.getElementById("homeSearchResults");
        resultBox.innerHTML = "";
        if (input === "") return;
        let allFalas = [
          "Gav dev Falni",
          "Mahit Fala",
          "Ganpati Vargani",
          "Navratri Vargani",
          "Holi Vargani",
        ];
        allFalas.forEach((falaName) => {
          let storageData = JSON.parse(localStorage.getItem(falaName)) || [];
          storageData.forEach((item) => {
            let combined = Object.values(item).join(" ").toLowerCase();
            if (combined.includes(input)) {
              let extraInfo =
                falaName === "Mahit Fala"
                  ? `<p><b>Family:</b> ${item.contactOrFamily}</p>`
                  : `<p><b>Contact:</b> ${item.contactOrFamily}</p>`;
              resultBox.innerHTML += `<div class="data-card fade-in"><h4>${falaName}</h4>${item.year ? `<p><b>Year:</b> ${item.year}</p>` : ""}<p><b>Name:</b> ${item.name}</p><p><b>Fala Rs:</b> ${item.fala}</p>${extraInfo}</div>`;
            }
          });
        });
      }

      let currentFala = "";
      function openFala(falaName) {
        stopGames();
        currentFala = falaName;
        renderFalaPage(falaName);
      }

      function renderFalaPage(falaName) {
        let isMahit = falaName === "Mahit Fala";
        document.getElementById("contentArea").innerHTML = `
          <div class="sticky-header">
            <h2 class="big-title">${falaName}</h2>
            <input type="text" id="searchInput" placeholder="Search records..." onkeyup="searchData()" style="width:100%; padding:15px 20px; border-radius:50px; border:2px solid #eee; outline:none;">
          </div>
          <p style="font-size:14px; margin:15px 0 10px; color:#666; font-weight:600;">Enter Person Information</p>
          <div class="form-container">
            <div class="dynamic-input"> <input type="text" id="name" placeholder="Full Name" required> </div>
            <div class="dynamic-input"> <input type="number" id="fala" placeholder="Fala Amount (Rs)" required> </div>
            <div class="dynamic-input"> <input type="date" id="date" required> </div>
            <div class="dynamic-input"> <input type="text" id="day" placeholder="Day (e.g., Monday)" required> </div>
            ${!isMahit ? `<div class="dynamic-input"><input type="text" id="year" placeholder="Year"></div>` : ""}
            <div class="dynamic-input"> <input type="text" id="contactFamily" placeholder="${isMahit ? "Family Name" : "Contact Number"}" required> </div>
            <button onclick="submitData()">Submit Data</button>
          </div>
          <div id="dataList"></div>`;
        displayData();
      }

      function submitData() {
        let isMahit = currentFala === "Mahit Fala";
        let name = document.getElementById("name").value.trim();
        let fala = document.getElementById("fala").value.trim();
        let date = document.getElementById("date").value.trim();
        let day = document.getElementById("day").value.trim();
        let contactOrFamily = document
          .getElementById("contactFamily")
          .value.trim();
        let year = "";
        if (!isMahit) {
          year = document.getElementById("year").value.trim();
        }
        if (
          !name ||
          !fala ||
          !date ||
          !day ||
          !contactOrFamily ||
          (!isMahit && !year)
        ) {
          showNotification("Please fill all information");
          return;
        }
        let data = { year, name, fala, date, day, contactOrFamily };
        let storageData = JSON.parse(localStorage.getItem(currentFala)) || [];
        storageData.push(data);
        localStorage.setItem(currentFala, JSON.stringify(storageData));
        showNotification("Data Saved!", "#2ed573");
        if (!isMahit && contactOrFamily.length > 9) {
          showSendReceiptPopup(data);
        } else {
          renderFalaPage(currentFala);
        }
      }

      function showSendReceiptPopup(data) {
        const msg = `Hi ${data.name}, your entry for ${currentFala} of Rs.${data.fala} on ${data.date} has been recorded. - Grampanchayat Kankradi`;
        const encodedMsg = encodeURIComponent(msg);
        const phone = data.contactOrFamily;
        const cleanPhone = phone.replace(/\D/g, "");
        const smsLink = `sms:${cleanPhone}?body=${encodedMsg}`;
        const waLink = `https://wa.me/91${cleanPhone}?text=${encodedMsg}`;
        const popupContent = `<a href="${smsLink}" class="popup-btn primary" style="text-decoration:none;"><i class="fas fa-sms"></i> Send SMS</a><a href="${waLink}" target="_blank" class="popup-btn success" style="text-decoration:none;"><i class="fab fa-whatsapp"></i> WhatsApp</a><button class="popup-btn secondary" onclick="closePopup()">Skip</button>`;
        showPopup(
          "Send Receipt?",
          `Send confirmation to ${data.name} (${phone})?`,
          null,
          null,
          popupContent,
        );
      }
      function closePopup() {
        const overlay = document.getElementById("popupOverlay");
        if (overlay) document.body.removeChild(overlay);
        renderFalaPage(currentFala);
      }

      function displayData() {
        let dataList = document.getElementById("dataList");
        let storageData = JSON.parse(localStorage.getItem(currentFala)) || [];
        let isMahit = currentFala === "Mahit Fala";
        dataList.innerHTML = "";
        storageData.forEach((item, index) => {
          let extraInfo = isMahit
            ? `<p><b>Family Name:</b> ${item.contactOrFamily}</p>`
            : `<p><b>Contact:</b> ${item.contactOrFamily}</p>`;
          let sendBtnHtml = "";
          if (!isMahit && item.contactOrFamily.length > 9) {
            sendBtnHtml = `<button class="game-btn" style="background:#27ae60; margin-top:10px; font-size:10px; padding:8px 12px;" onclick="resendReceipt(${index})"><i class="fas fa-paper-plane"></i> Send Receipt</button>`;
          }
          dataList.innerHTML += `
            <div class="data-card list-item-enter" style="animation-delay: ${index * 0.05}s">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 style="margin:0; color:#2c3e50;">${item.name}</h4>
                <span style="background:#1abc9c; color:white; padding:4px 10px; border-radius:15px; font-size:12px;">Rs. ${item.fala}</span>
              </div>
              <hr style="border:0; border-top:1px solid #eee; margin:10px 0;">
              ${!isMahit ? `<p><b>Year:</b> ${item.year}</p>` : ""}
              <p><b>Date:</b> ${item.date} (${item.day})</p>
              ${extraInfo}
              <div style="display:flex; gap:10px; margin-top:10px;">
                <button class="delete-btn" onclick="deleteData(${index})">Delete</button>
                ${sendBtnHtml}
              </div>
            </div>`;
        });
      }

      function resendReceipt(index) {
        let storageData = JSON.parse(localStorage.getItem(currentFala)) || [];
        let item = storageData[index];
        if (item) {
          showSendReceiptPopup(item);
        }
      }

      function deleteData(index) {
        if (confirm("Are you sure?")) {
          let storageData = JSON.parse(localStorage.getItem(currentFala)) || [];
          storageData.splice(index, 1);
          localStorage.setItem(currentFala, JSON.stringify(storageData));
          showNotification("Deleted", "#e74c3c");
          displayData();
        }
      }

      function searchData() {
        let input = document.getElementById("searchInput").value.toLowerCase();
        let storageData = JSON.parse(localStorage.getItem(currentFala)) || [];
        let dataList = document.getElementById("dataList");
        let isMahit = currentFala === "Mahit Fala";
        dataList.innerHTML = "";
        storageData.forEach((item, index) => {
          let combined = Object.values(item).join(" ").toLowerCase();
          if (combined.includes(input)) {
            let extraInfo = isMahit
              ? `<p><b>Family Name:</b> ${item.contactOrFamily}</p>`
              : `<p><b>Contact:</b> ${item.contactOrFamily}</p>`;
            dataList.innerHTML += `<div class="data-card fade-in"><h4>${currentFala}</h4>${!isMahit ? `<p><b>Year:</b> ${item.year}</p>` : ""}<p><b>Name:</b> ${item.name}</p><p><b>Fala Rs:</b> ${item.fala}</p><p><b>Date:</b> ${item.date}</p><p><b>Day:</b> ${item.day}</p>${extraInfo}<button class="delete-btn" onclick="deleteData(${index})">Delete</button></div>`;
          }
        });
      }

      function showTotal() {
        stopGames();
        document.getElementById("contentArea").innerHTML = `
          <h2 class="big-title">Total Records</h2>
          <div class="form-container fade-in">
            <div class="dynamic-input">
                <select id="totalFalni" onchange="toggleTotalFamilyInput()">
                    <option value="Gav dev Falni">Gav dev Falni</option>
                    <option value="Mahit Fala">Mahit Fala</option>
                    <option value="Ganpati Vargani">Ganpati Vargani</option>
                    <option value="Navratri Vargani">Navratri Vargani</option>
                    <option value="Holi Vargani">Holi Vargani</option>
                </select>
            </div>
            <div class="dynamic-input" id="totalYearWrapper"><input type="text" id="totalYear" placeholder="Year (Optional)"></div>
            <div class="dynamic-input" id="totalFamilyWrapper" style="display:none;"><input type="text" id="totalFamily" placeholder="Family Name"></div>
            <button onclick="calculateTotal()">Calculate Total</button>
          </div>
          <div id="totalResult"></div><hr style="border:0; border-top:1px solid #ddd; margin:20px 0;"><h3 style="color:#666;">Saved History</h3><div id="historyList"></div>`;
        displayTotalRecords();
      }

      function toggleTotalFamilyInput() {
        let val = document.getElementById("totalFalni").value;
        let familyWrapper = document.getElementById("totalFamilyWrapper");
        let yearWrapper = document.getElementById("totalYearWrapper");
        if (val === "Mahit Fala") {
          familyWrapper.style.display = "block";
          yearWrapper.style.display = "none";
        } else {
          familyWrapper.style.display = "none";
          yearWrapper.style.display = "block";
        }
      }

      function calculateTotal() {
        let falniName = document.getElementById("totalFalni").value;
        let year = document.getElementById("totalYear").value.trim();
        let familyName = document.getElementById("totalFamily").value.trim();
        let resultBox = document.getElementById("totalResult");
        let storageData = JSON.parse(localStorage.getItem(falniName)) || [];
        let total = 0;
        let memberCount = 0;
        storageData.forEach((item) => {
          if (falniName === "Mahit Fala") {
            if (
              (familyName === "" ||
                (item.contactOrFamily &&
                  item.contactOrFamily.toLowerCase() ===
                    familyName.toLowerCase())) &&
              item.fala
            ) {
              total += Number(item.fala);
              memberCount++;
            }
          } else {
            if ((year === "" || item.year === year) && item.fala) {
              total += Number(item.fala);
              memberCount++;
            }
          }
        });
        let totalStorage =
          JSON.parse(localStorage.getItem("TotalRecords")) || [];
        totalStorage.push({
          falniName,
          year,
          familyName,
          total,
          memberCount,
          date: new Date().toLocaleDateString(),
        });
        localStorage.setItem("TotalRecords", JSON.stringify(totalStorage));
        resultBox.innerHTML = `<div class="data-card fade-in" style="border-left-color: #1abc9c;"><h3>Result</h3><p><b>Fala:</b> ${falniName}</p>${falniName === "Mahit Fala" ? `<p><b>Family:</b> ${familyName || "All"}</p>` : `<p><b>Year:</b> ${year || "All"}</p>`}<h2 style="color:#1abc9c; margin:0;">Total: ₹${total}</h2><h3 style="color:#3498db; margin-top:10px;">Total Members: ${memberCount}</h3></div>`;
        displayTotalRecords();
      }

      function displayTotalRecords() {
        let historyBox = document.getElementById("historyList");
        if (!historyBox) return;
        let totalStorage =
          JSON.parse(localStorage.getItem("TotalRecords")) || [];
        historyBox.innerHTML = "";
        totalStorage.reverse().forEach((item, index) => {
          historyBox.innerHTML += `<div class="data-card slide-in"><p><b>${item.falniName}</b> (${item.date})</p>${item.falniName === "Mahit Fala" ? `<p>Family: ${item.familyName || "All"}</p>` : `<p>Year: ${item.year || "All"}</p>`}<h3>Total: ₹${item.total}</h3><p><b>Members:</b> ${item.memberCount || 0}</p><button class="delete-btn" onclick="deleteTotalRecord(${totalStorage.length - 1 - index})">Delete</button></div>`;
        });
      }

      function deleteTotalRecord(index) {
        let totalStorage =
          JSON.parse(localStorage.getItem("TotalRecords")) || [];
        totalStorage.splice(index, 1);
        localStorage.setItem("TotalRecords", JSON.stringify(totalStorage));
        showTotal();
      }

      /* ===== NOTEPAD ===== */
      function showNotepad() {
        stopGames();
        let savedNotes =
          JSON.parse(localStorage.getItem("userNotesList")) || [];

        let notesHtml = "";
        savedNotes.forEach((note, index) => {
          notesHtml += `
              <div class="note-item fade-in">
                 <button class="note-delete-btn" onclick="deleteNote(${index})"><i class="fas fa-times"></i></button>
                 <p>${note.text}</p>
                 <small>${note.date}</small>
              </div>`;
        });

        document.getElementById("contentArea").innerHTML = `
          <div class="sticky-header">
            <h2 class="big-title">Note Pad</h2>
          </div>
          <div class="notepad-container fade-in">
            <div class="notepad-header">
              <h3><i class="fas fa-sticky-note"></i> Write Note</h3>
            </div>
            <div class="notepad-body">
              <textarea class="notepad-textarea" id="notepadContent" placeholder="Write your note here..."></textarea>
              <button class="notepad-save-btn" onclick="saveNote()" style="width:100%; margin-top:10px;"><i class="fas fa-save"></i> Save Note</button>
            </div>
            
            <div style="padding: 0 20px 20px 20px;">
              <div class="saved-notes-title">Saved Notes (${savedNotes.length})</div>
              <div class="saved-notes-list" id="savedNotesList">
                ${notesHtml || "<p style='color:#999; text-align:center;'>No notes yet.</p>"}
              </div>
            </div>
          </div>`;
      }

      function saveNote() {
        let content = document.getElementById("notepadContent").value.trim();
        if (!content) {
          showNotification("Note is empty", "#e67e22");
          return;
        }

        let notes = JSON.parse(localStorage.getItem("userNotesList")) || [];
        notes.unshift({ text: content, date: new Date().toLocaleString() });

        localStorage.setItem("userNotesList", JSON.stringify(notes));
        showNotification("Note Saved!", "#2ed573");
        showNotepad();
      }

      function deleteNote(index) {
        let notes = JSON.parse(localStorage.getItem("userNotesList")) || [];
        notes.splice(index, 1);
        localStorage.setItem("userNotesList", JSON.stringify(notes));
        showNotepad();
      }

      /* ===== CALCULATOR ===== */
      function showCalculator() {
        stopGames();
        document.getElementById("contentArea").innerHTML =
          `<h2 class="big-title">Calculator</h2><div class="calc-container fade-in"><div class="calc-display" id="calcDisplay">0</div><div class="calc-grid"><button class="calc-btn action" onclick="calcClear()">C</button><button class="calc-btn operator" onclick="calcInput('/')">÷</button><button class="calc-btn operator" onclick="calcInput('*')">×</button><button class="calc-btn action" onclick="calcBackspace()"><i class="fas fa-backspace"></i></button><button class="calc-btn" onclick="calcInput('7')">7</button><button class="calc-btn" onclick="calcInput('8')">8</button><button class="calc-btn" onclick="calcInput('9')">9</button><button class="calc-btn operator" onclick="calcInput('-')">-</button><button class="calc-btn" onclick="calcInput('4')">4</button><button class="calc-btn" onclick="calcInput('5')">5</button><button class="calc-btn" onclick="calcInput('6')">6</button><button class="calc-btn operator" onclick="calcInput('+')">+</button><button class="calc-btn" onclick="calcInput('1')">1</button><button class="calc-btn" onclick="calcInput('2')">2</button><button class="calc-btn" onclick="calcInput('3')">3</button><button class="calc-btn equals" onclick="calcResult()" style="grid-row: span 2;">=</button><button class="calc-btn" onclick="calcInput('0')" style="grid-column: span 2;">0</button><button class="calc-btn" onclick="calcInput('.')">.</button></div></div>`;
      }
      let calcExpression = "";
      function calcInput(val) {
        if (calcExpression === "0" && !isNaN(val)) calcExpression = "";
        calcExpression += val;
        document.getElementById("calcDisplay").innerText = calcExpression;
      }
      function calcClear() {
        calcExpression = "";
        document.getElementById("calcDisplay").innerText = "0";
      }
      function calcBackspace() {
        calcExpression = calcExpression.slice(0, -1);
        document.getElementById("calcDisplay").innerText =
          calcExpression || "0";
      }
      function calcResult() {
        try {
          let res = eval(calcExpression);
          document.getElementById("calcDisplay").innerText = res;
          calcExpression = res.toString();
        } catch (e) {
          document.getElementById("calcDisplay").innerText = "Error";
          calcExpression = "";
        }
      }

      /* ===== SETTINGS ===== */
      function showSettings() {
        stopGames();
        document.getElementById("contentArea").innerHTML =
          `<h2 class="big-title">Settings</h2><div class="info-box fade-in" onclick="showWebInfo()"><i class="fas fa-globe"></i><h2>Info this Web</h2><p>About the website</p></div><div id="settingsContent"></div><div class="data-card fade-in" style="margin-top:20px;"><h3 style="margin-top:0; text-align:center; color:#2c3e50;">Connect on Social Media</h3>
            <div class="social-grid">
              <a href="https://www.instagram.com/cr.atul_vedga_45" target="_blank" class="social-btn bg-insta"><i class="fab fa-instagram"></i> Instagram</a>
              <a href="https://facebook.com/share/1XXsyEjTL3" target="_blank" class="social-btn bg-fb"><i class="fab fa-facebook-f"></i> Facebook</a>
              <a href="https://wa.me/8766573113" target="_blank" class="social-btn bg-wa"><i class="fab fa-whatsapp"></i> WhatsApp</a>
              <a href="https://www.youtube.com/@Cr.Atul_Vedga45" target="_blank" class="social-btn bg-yt"><i class="fab fa-youtube"></i> YouTube</a>
              <a href="https://www.linkedin.com/in/atul-vedga-4b0413378/" target="_blank" class="social-btn bg-li" style="grid-column: span 2;"><i class="fab fa-linkedin-in"></i> LinkedIn</a></div></div><div class="data-card slide-in" style="margin-top:20px; cursor:pointer;" onclick="showCreatorInfo()"><div style="display:flex; align-items:center; gap:15px;"><i class="fas fa-user-circle" style="font-size:40px; color:#3498db;"></i><div><h3 style="margin:0; color:#2c3e50;">Creator Info</h3><p style="margin:0; font-size:12px; color:#666;">Click to view details</p></div></div></div>`;
      }
      function showWebInfo() {
        document.getElementById("settingsContent").innerHTML =
          `<div class="data-card fade-in" style="text-align:center; margin-top:20px;"><h2 style="color:#1abc9c;">Welcome!</h2><p style="font-size:16px; line-height:1.6; color:#555;">This website has been specially developed for Kankradi Grampanchayat to manage Falni/Vargani data efficiently and securely. The system allows you to generate PDF reports and send receipts directly via SMS or WhatsApp from the application. This platform is designed exclusively for Kankradi Grampanchayat use and ensures that all data is handled safely and securely. <br><br>

The website was created and developed by Atul Vedga, a Software Engineering student, with the aim of providing a reliable, secure, and user-friendly digital solution for the village.<br><br>

If your village or organization needs a similar website, or if you would like a personal website developed, you can contact Atul Vedga for professional web development services.</p></div>`;
      }
      function showCreatorInfo() {
        document.getElementById("contentArea").innerHTML =
          `<div class="profile-header fade-in"><img src="WhatsApp Image 2026-01-11 at 10.07.45 AM.jpeg" alt="Creator"><h2>Atul Vedga</h2><p style="opacity:0.8;">Developer & Designer</p></div><div class="data-card slide-in"><h3 style="margin-top:0; text-align:center;">About Me</h3><p style="text-align:center;">Hello! <br>
My self Atul Vedga. I am from Palghar district in dahanu taluka. I Training in THE BAAP COMPANY. Student of Software Engrining. I created this platform to help our village. Contact me for any help.</p><button class="back-btn" onclick="showSettings()"><i class="fas fa-arrow-left"></i> Back</button></div>`;
      }

      /* ===== GALLERY FUNCTION ===== */
      function showGallery() {
        stopGames();
        document.getElementById("contentArea").innerHTML = `
          <div class="sticky-header"><h2 class="big-title">Village Image</h2></div>
          
          <div class="gallery-container fade-in">
            <div class="gallery-item">
              <img src="shared image (1).jpg" alt="Image 1">
            </div>
            <div class="gallery-item">
              <img src="shared image (3).jpg" alt="Image 2">
            </div>
            <div class="gallery-item">
              <img src="shared image (12).jpg" alt="Image 3">
            </div>
            <div class="gallery-item">
              <img src="shared image (5).jpg" alt="Image 4">
            </div>
            <div class="gallery-item">
              <img src="shared image.jpg" alt="Image 5">
            </div>
                        <div class="gallery-item">
              <img src="shared image (2).jpg" alt="Image 4">
            </div>
            <div class="gallery-item">
              <img src="shared image (8).jpg" alt="Image 5">
            </div>
            <div class="gallery-item">
              <img src="shared image (10).jpg" alt="Image 5">
            </div>
            <div class="gallery-item">
              <img src="shared image (6).jpg" alt="Image 5">
            </div>
            <div class="gallery-item">
              <img src="shared image (11).jpg" alt="Image 5">
            </div>
                        <div class="gallery-item">
              <img src="shared image (7).jpg" alt="Image 5">
            </div>
            <div class="gallery-item">
              <img src="shared image (4).jpg" alt="Image 5">
            </div>
          </div>
          <button class="go-back-btn" onclick="showHome()"><i class="fas fa-arrow-left"></i> Go Back</button>
        `;
      }

      /* ===== WHATSAPP CHAT ===== */
      /* ===== CHAT BOX LOGIC ===== */
      const chatEmojis = {
        faces: [
          "😀",
          "😃",
          "😄",
          "😁",
          "😅",
          "😂",
          "🤣",
          "😊",
          "😇",
          "🙂",
          "😉",
          "😍",
          "🥰",
          "😘",
          "😋",
          "😛",
          "😜",
          "🤪",
          "😎",
          "🤩",
          "🥳",
          "😏",
          "😒",
          "😞",
          "😢",
          "😭",
          "😤",
          "😡",
          "🤯",
          "😱",
          "🥶",
          "😴",
        ],
        gestures: [
          "👋",
          "🤚",
          "🖐️",
          "✋",
          "🖖",
          "👌",
          "🤌",
          "🤏",
          "✌️",
          "🤞",
          "🤟",
          "🤘",
          "🤙",
          "👈",
          "👉",
          "👆",
          "🖕",
          "👇",
          "☝️",
          "👍",
          "👎",
          "✊",
          "👊",
          "🤛",
          "🤜",
          "👏",
          "🙌",
          "👐",
          "🤲",
          "🤝",
          "🙏",
        ],
        hearts: [
          "❤️",
          "🧡",
          "💛",
          "💚",
          "💙",
          "💜",
          "🖤",
          "🤍",
          "🤎",
          "💔",
          "❣️",
          "💕",
          "💞",
          "💓",
          "💗",
          "💖",
          "💘",
          "💝",
          "💟",
          "♥️",
        ],
        objects: [
          "🎉",
          "🎊",
          "🎈",
          "🎁",
          "🎀",
          "🏆",
          "🏅",
          "🥇",
          "⚡",
          "🔥",
          "✨",
          "💫",
          "🌟",
          "⭐",
          "💡",
          "💎",
          "💰",
          "🎯",
          "🚀",
          "✈️",
          "🌈",
          "☀️",
          "🌙",
          "⭐",
        ],
      };
      const chatResponses = {
        greetings: [
          "Hey there! How's it going?",
          "Hi! What's on your mind?",
          "Hello! Great to hear from you!",
          "Hey! How can I help you today?",
        ],
        howAreYou: [
          "I'm doing well, thanks for asking! How about you?",
          "All good here! What about you?",
        ],
        help: [
          "Sure, I'd love to help! What do you need?",
          "Of course! What can I do for you?",
        ],
        thanks: [
          "You're welcome! Anything else?",
          "No problem at all! Happy to help.",
        ],
        bye: ["Goodbye! Take care!", "Bye! Have a great day!"],
        password: "I don't know, please contact Atul.",
        fallback: [
          "Sorry, I can't understand. Could you rephrase?",
          "Hmm, I'm not sure I follow. Can you explain?",
        ],
      };

      function showChat() {
        stopGames();
        document.getElementById("contentArea").innerHTML = `
        <div class="chat-wrapper fade-in">
          <div class="bg-decoration"><div class="bg-blob bg-blob-1"></div><div class="bg-blob bg-blob-2"></div></div>
          <div class="chat-container">
            <div class="chat-header">
              <div class="chat-back-btn" onclick="showHome()"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></div>
              <div class="profile-section">
                <div class="profile-pic-wrapper"><img src="WhatsApp Image 2026-01-11 at 10.07.48 AM (1).jpeg" alt="Atul" class="profile-pic" /><div class="online-indicator"></div></div>
                <div class="user-info"><div class="username">Atul Vedga</div><div class="status" id="userStatus">online</div></div>
              </div>
              <div class="action-buttons">
                <div class="action-btn menu" id="menuBtn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg></div>
                <div class="dropdown-menu" id="dropdownMenu"><div class="dropdown-item" id="clearChat"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg><span>Clear Chat</span></div></div>
              </div>
            </div>
            <div class="chat-area" id="chatArea"><div class="date-divider"><span>Today</span></div></div>
            <div class="typing-wrapper" id="typingWrapper"><div class="typing-bubble"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=atul&backgroundColor=00d4aa" alt="" class="typing-avatar" /><div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div></div>
            <div class="quick-replies" id="quickReplies"><button class="quick-reply-btn" data-msg="Hello!">Hello</button><button class="quick-reply-btn" data-msg="How are you?">How are you?</button><button class="quick-reply-btn" data-msg="I need help">I need help</button></div>
            <div class="input-area">
              <div class="emoji-panel" id="emojiPanel"><div class="emoji-category-tabs"><button class="emoji-category-tab active" data-category="faces">Faces</button><button class="emoji-category-tab" data-category="gestures">Gestures</button><button class="emoji-category-tab" data-category="hearts">Hearts</button></div><div class="emoji-grid" id="emojiGrid"></div></div>
              <div class="input-wrapper"><input type="text" class="chat-input" id="chatInput" placeholder="Type a message..." autocomplete="off" /><div class="input-actions"><div class="input-btn emoji-btn" id="emojiBtn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg></div></div></div>
              <div class="send-btn" id="sendBtn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg></div>
            </div>
          </div>
        </div>
        <div class="chat-popup-overlay" id="chatPopupOverlay"><div class="chat-popup"><div class="popup-icon warning" id="chatPopupIcon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg></div><div class="popup-title" id="chatPopupTitle">Permission Denied</div><div class="popup-message" id="chatPopupMessage">You don't have permission.</div><button class="popup-btn" id="chatPopupBtn">Got it</button></div></div>`;

        initChatLogic();
      }

      function initChatLogic() {
        const chatArea = document.getElementById("chatArea");
        const chatInput = document.getElementById("chatInput");
        const sendBtn = document.getElementById("sendBtn");
        const typingWrapper = document.getElementById("typingWrapper");
        const userStatus = document.getElementById("userStatus");
        const menuBtn = document.getElementById("menuBtn");
        const dropdownMenu = document.getElementById("dropdownMenu");
        const emojiBtn = document.getElementById("emojiBtn");
        const emojiPanel = document.getElementById("emojiPanel");
        const emojiGrid = document.getElementById("emojiGrid");
        const clearChatBtn = document.getElementById("clearChat");
        const quickReplies = document.getElementById("quickReplies");
        const chatPopupOverlay = document.getElementById("chatPopupOverlay");
        const chatPopupBtn = document.getElementById("chatPopupBtn");

         let currentEmojiCategory = "faces";



        function renderEmojis(category) {
          currentEmojiCategory = category;
          const categoryEmojis = chatEmojis[category] || [];
          emojiGrid.innerHTML = categoryEmojis
            .map(
              (emoji) =>
                `<button class="emoji-item" data-emoji="${emoji}">${emoji}</button>`,
            )
            .join("");
          document.querySelectorAll(".emoji-category-tab").forEach((tab) => {
            tab.classList.toggle("active", tab.dataset.category === category);
          });
        }
        renderEmojis("faces");
        document.querySelectorAll(".emoji-category-tab").forEach((tab) => {
          tab.addEventListener("click", () => {
            renderEmojis(tab.dataset.category);
          });
        });
        emojiGrid.addEventListener("click", (e) => {
          if (e.target.classList.contains("emoji-item")) {
            chatInput.value += e.target.dataset.emoji;
            chatInput.focus();
          }
        });
        emojiBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          emojiPanel.classList.toggle("active");
        });
        menuBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          dropdownMenu.classList.toggle("active");
        });
        document.addEventListener("click", (e) => {
          if (!emojiPanel.contains(e.target) && e.target !== emojiBtn)
            emojiPanel.classList.remove("active");
          if (!dropdownMenu.contains(e.target) && e.target !== menuBtn)
            dropdownMenu.classList.remove("active");
        });
        clearChatBtn.addEventListener("click", () => {
          const messages = chatArea.querySelectorAll(".message");
          messages.forEach((msg) => msg.remove());
          dropdownMenu.classList.remove("active");
        });
        chatPopupBtn.addEventListener("click", () => {
          chatPopupOverlay.classList.remove("active");
        });

        function getRandomItem(arr) {
          return arr[Math.floor(Math.random() * arr.length)];
        }
        function getCurrentTime() {
          const now = new Date();
          return now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        }
        function addMessage(text, type, isEmojiMsg = false) {
          const messageDiv = document.createElement("div");
          messageDiv.className = `message ${type}${isEmojiMsg ? " message-emoji" : ""}`;
          const readReceiptHtml =
            type === "sent"
              ? `<div class="message-meta"><span class="message-time">${getCurrentTime()}</span></div>`
              : `<span class="message-time">${getCurrentTime()}</span>`;
          messageDiv.innerHTML = `${text}${readReceiptHtml}`;
          chatArea.appendChild(messageDiv);
          chatArea.scrollTop = chatArea.scrollHeight;
          return messageDiv;
        }
        function showTyping() {
          typingWrapper.classList.add("active");
          chatArea.appendChild(typingWrapper);
          chatArea.scrollTop = chatArea.scrollHeight;
          userStatus.textContent = "typing...";
          userStatus.classList.add("status-typing");
        }
        function hideTyping() {
          typingWrapper.classList.remove("active");
          userStatus.textContent = "online";
          userStatus.classList.remove("status-typing");
        }
        function isEmojiOnly(text) {
          const emojiRegex =
            /^[\p{Emoji}\p{Emoji_Component}\p{Emoji_Modifier}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]+$/u;
          return emojiRegex.test(text.trim());
        }



        function getResponse(userMessage) {
          const lowerMsg = userMessage.toLowerCase().trim();
          if (isEmojiOnly(userMessage)) {
            return userMessage;
          }
          if (lowerMsg.includes("password")) {
            return chatResponses.password;
          }
          if (/^(hi|hello|hey|hii|hiii|greetings)/i.test(lowerMsg)) {
            return getRandomItem(chatResponses.greetings);
          }
          if (/how are you|how('s| is) it going|what's up/i.test(lowerMsg)) {
            return getRandomItem(chatResponses.howAreYou);
          }
          if (/help|need help|can you help/i.test(lowerMsg)) {
            return getRandomItem(chatResponses.help);
          }
          if (/thank|thanks|thx/i.test(lowerMsg)) {
            return getRandomItem(chatResponses.thanks);
          }
          if (/bye|goodbye|see you|later/i.test(lowerMsg)) {
            return getRandomItem(chatResponses.bye);
          }
          return getRandomItem(chatResponses.fallback);
        }

        function handleSend() {
          const message = chatInput.value.trim();
          if (!message) return;
          quickReplies.classList.remove("active");
          emojiPanel.classList.remove("active");
          addMessage(message, "sent", isEmojiOnly(message));
          chatInput.value = "";
          showTyping();
          setTimeout(
            () => {
              hideTyping();
              const response = getResponse(message);
              addMessage(response, "received", isEmojiOnly(response));
            },
            1000 + Math.random() * 500,
          );
        }

        sendBtn.addEventListener("click", handleSend);
        chatInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") handleSend();
        });

        quickReplies.querySelectorAll(".quick-reply-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            chatInput.value = btn.dataset.msg;
            handleSend();
          });
        });

        // Initial message
        setTimeout(() => {
          addMessage("Hii", "received");
          quickReplies.classList.add("active");
        }, 600);
        chatInput.focus();
      }

    


      /* ===== DATA PROCESS LOGIC ===== */
      function showDataProcessMenu() {
        stopGames();
        document.getElementById("contentArea").innerHTML =
          `<div class="sticky-header"><h2 class="big-title">Data Process</h2></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;"><div class="info-box fade-in" onclick="showDataProcessPassword('particular')" style="margin:0; display:flex; flex-direction:column; justify-content:center; height:200px;"><i class="fas fa-filter"></i><h2 style="font-size:18px;">Particular Data</h2><p style="font-size:12px; opacity:0.9;">Select Specific falni/Year</p></div><div class="info-box fade-in" onclick="showDataProcessPassword('all')" style="margin:0; background:linear-gradient(135deg, #e74c3c, #c0392b); display:flex; flex-direction:column; justify-content:center; height:200px;"><i class="fas fa-database"></i><h2 style="font-size:18px;">All Data</h2><p style="font-size:12px; opacity:0.9;">Download Complete Report</p></div></div>`;
      }
      function showDataProcessPassword(type) {
        window.dpMode = type;
        document.getElementById("contentArea").innerHTML =
          `<div class="sticky-header"><h2 class="big-title">Secure Access</h2></div><div class="dp-password-container fade-in"><div class="dp-lock-icon"><i class="fas fa-lock"></i></div><h3 class="dp-title">Authentication Required</h3><p class="dp-subtitle">Enter 6-digit PIN to access data</p><div class="dp-code-group"><input type="password" class="dp-code-input" maxlength="1" id="dp1" oninput="moveToNext(this, 'dp2')"><input type="password" class="dp-code-input" maxlength="1" id="dp2" oninput="moveToNext(this, 'dp3')"><input type="password" class="dp-code-input" maxlength="1" id="dp3" oninput="moveToNext(this, 'dp4')"><input type="password" class="dp-code-input" maxlength="1" id="dp4" oninput="moveToNext(this, 'dp5')"><input type="password" class="dp-code-input" maxlength="1" id="dp5" oninput="moveToNext(this, 'dp6')"><input type="password" class="dp-code-input" maxlength="1" id="dp6" oninput="moveToNext(this, 'dpSubmitBtn')"></div><button id="dpSubmitBtn" class="dp-submit-btn" onclick="validateDataProcessPassword()"><i class="fas fa-unlock-alt"></i> Verify & Continue</button><button class="dp-back-btn" onclick="showDataProcessMenu()"><i class="fas fa-arrow-left"></i> Go Back</button></div>`;
        document.getElementById("dp1").focus();
      }
      function validateDataProcessPassword() {
        let code = "";
        for (let i = 1; i <= 6; i++) {
          code += document.getElementById("dp" + i).value;
        }
        if (code === "Atul45") {
          showNotification("Access Granted", "#2ed573");
          if (window.dpMode === "all") showAllDataProcess();
          else showParticularDataProcess();
        } else {
          showNotification("Incorrect Password");
          for (let i = 1; i <= 6; i++)
            document.getElementById("dp" + i).value = "";
          document.getElementById("dp1").focus();
        }
      }
      function showParticularDataProcess() {
        const years = [
          "2026",
          "2027",
          "2028",
          "2029",
          "2030",
          "2031",
          "2032",
          "2033",
          "2034",
          "2035",
          "2036",
          "2037",
          "2038",
          "2039",
          "2040",
        ];
        let yearOptions = years
          .map((y) => `<option value="${y}">${y}</option>`)
          .join("");
        document.getElementById("contentArea").innerHTML =
          `<div class="sticky-header"><h2 class="big-title">Particular Data</h2></div><div class="form-container fade-in"><div class="dynamic-input"><label><i class="fas fa-list"></i> Select Falni</label><select id="dpFalni" onchange="toggleProcessInputs()"><option value="">Select...</option><option value="Gav dev Falni">Gav dev Falni</option><option value="Mahit Fala">Mahit Fala</option><option value="Ganpati Vargani">Ganpati Vargani</option><option value="Navratri Vargani">Navratri Vargani</option><option value="Holi Vargani">Holi Vargani</option></select></div><div class="dynamic-input" id="dpYearWrapper" style="display:none;"><label><i class="fas fa-calendar"></i> Select Year</label><select id="dpYear"><option value="">-- Select Year --</option>${yearOptions}</select></div><div class="dynamic-input" id="dpFamilyWrapper" style="display:none;"><label><i class="fas fa-users"></i> Family Name</label><input type="text" id="dpFamily" placeholder="Enter Family Name"></div><div class="btn-group"><button onclick="viewParticularData()"><i class="fas fa-eye"></i> View Data</button><button class="btn-secondary" onclick="generateParticularPDF()"><i class="fas fa-file-pdf"></i> Download PDF</button></div></div><div id="viewDataContainer"></div><button class="go-back-btn" onclick="showDataProcessMenu()"><i class="fas fa-arrow-left"></i> Go Back to Data Process</button>`;
      }
      function toggleProcessInputs() {
        let val = document.getElementById("dpFalni").value;
        let yearWrapper = document.getElementById("dpYearWrapper");
        let familyWrapper = document.getElementById("dpFamilyWrapper");
        if (val === "Mahit Fala") {
          yearWrapper.style.display = "none";
          familyWrapper.style.display = "block";
        } else if (val !== "") {
          yearWrapper.style.display = "block";
          familyWrapper.style.display = "none";
        } else {
          yearWrapper.style.display = "none";
          familyWrapper.style.display = "none";
        }
      }
      function viewParticularData() {
        let falniName = document.getElementById("dpFalni").value;
        if (!falniName) {
          showNotification("Please select Falni");
          return;
        }
        let year = document.getElementById("dpYear")
          ? document.getElementById("dpYear").value
          : "";
        let family = document.getElementById("dpFamily")
          ? document.getElementById("dpFamily").value.trim()
          : "";
        if (falniName === "Mahit Fala") {
          if (!family) {
            showNotification("Please enter Family Name");
            return;
          }
        } else {
          if (!year) {
            showNotification("Please select Year");
            return;
          }
        }
        let storageData = JSON.parse(localStorage.getItem(falniName)) || [];
        let filteredData = [];
        let totalSum = 0;
        storageData.forEach((item) => {
          let match = true;
          if (falniName === "Mahit Fala") {
            if (
              family &&
              item.contactOrFamily.toLowerCase() !== family.toLowerCase()
            )
              match = false;
          } else {
            if (year && item.year !== year) match = false;
          }
          if (match) {
            filteredData.push(item);
            if (item.fala) totalSum += parseFloat(item.fala);
          }
        });
        let html = `<h3 style="color:#2c3e50; margin-top:20px;">Results (${filteredData.length})</h3>`;
        filteredData.forEach((item) => {
          html += `<div class="data-card fade-in"><p><b>Name:</b> ${item.name} <b style="float:right">Rs. ${item.fala}</b></p><p><b>Date:</b> ${item.date} <b>Year:</b> ${item.year || "N/A"}</p></div>`;
        });
        if (filteredData.length === 0)
          html +=
            "<p style='text-align:center; color:#999; margin-top:20px;'>No records found.</p>";
        else
          html += `<div class="summary-box" style="margin-top:20px;"><h3>Total Amount: Rs. ${totalSum}</h3></div>`;
        document.getElementById("viewDataContainer").innerHTML = html;
      }
      function generateParticularPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let falniName = document.getElementById("dpFalni").value;
        if (!falniName) {
          showNotification("Please select Falni");
          return;
        }
        let year = document.getElementById("dpYear")
          ? document.getElementById("dpYear").value
          : "";
        let family = document.getElementById("dpFamily")
          ? document.getElementById("dpFamily").value.trim()
          : "";
        if (falniName === "Mahit Fala") {
          if (!family) {
            showNotification("Please enter Family Name to download PDF");
            return;
          }
        } else {
          if (!year) {
            showNotification("Please select Year to download PDF");
            return;
          }
        }
        let storageData = JSON.parse(localStorage.getItem(falniName)) || [];
        let filteredData = [];
        let totalSum = 0;
        storageData.forEach((item) => {
          let match = true;
          if (falniName === "Mahit Fala") {
            if (
              family &&
              item.contactOrFamily.toLowerCase() !== family.toLowerCase()
            )
              match = false;
          } else {
            if (year && item.year !== year) match = false;
          }
          if (match) {
            filteredData.push(item);
            if (item.fala) totalSum += parseFloat(item.fala);
          }
        });
        if (filteredData.length === 0) {
          showNotification("No data found to generate PDF");
          return;
        }
        doc.setFontSize(18);
        doc.text("Grampanchayat Kankradi Report", 14, 22);
        doc.setFontSize(12);
        doc.text(`Category: ${falniName}`, 14, 32);
        if (falniName === "Mahit Fala" && family)
          doc.text(`Family: ${family}`, 14, 40);
        else if (year) doc.text(`Year: ${year}`, 14, 40);
        let rows = [];
        filteredData.forEach((item, index) => {
          rows.push([
            index + 1,
            item.name,
            item.fala,
            item.date,
            item.contactOrFamily,
          ]);
        });
        doc.autoTable({
          startY: 45,
          head: [["#", "Name", "Amount", "Date", "Contact/Family"]],
          body: rows,
          theme: "grid",
          headStyles: { fillColor: [26, 188, 156] },
        });
        let finalY = doc.lastAutoTable.finalY || 45;
        doc.setFontSize(14);
        doc.text(`Total Amount: Rs. ${totalSum}`, 14, finalY + 10);
        doc.text(`Total Entries: ${filteredData.length}`, 14, finalY + 18);
        doc.save(`${falniName}_Report.pdf`);
        showNotification("PDF Downloaded", "#2ed573");
      }
      function showAllDataProcess() {
        let totalEntries = 0;
        let grandTotal = 0;
        [
          "Gav dev Falni",
          "Mahit Fala",
          "Ganpati Vargani",
          "Navratri Vargani",
          "Holi Vargani",
        ].forEach((name) => {
          let d = JSON.parse(localStorage.getItem(name)) || [];
          d.forEach((i) => {
            if (i.fala) grandTotal += Number(i.fala);
          });
          totalEntries += d.length;
        });
        document.getElementById("contentArea").innerHTML =
          `<div class="sticky-header"><h2 class="big-title">All Data Report</h2></div><div class="form-container fade-in"><p style="text-align:center; color:#555;">Click below to generate a complete PDF report containing all records from all categories.</p><button onclick="generateAllDataPDF()"><i class="fas fa-file-pdf"></i> Download All Data PDF</button></div><div class="data-card fade-in" style="text-align:center; margin-top:20px;"><h3>Database Summary</h3><p><b>Total Records:</b> ${totalEntries}</p><p><b>Grand Total Amount:</b> Rs. ${grandTotal.toLocaleString()}</p></div><button class="go-back-btn" onclick="showDataProcessMenu()"><i class="fas fa-arrow-left"></i> Go Back to Data Process</button>`;
      }
      function generateAllDataPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let yPos = 22;
        doc.setFontSize(22);
        doc.setTextColor(44, 62, 80);
        doc.text("Grampanchayat Kankradi", 14, yPos);
        yPos += 10;
        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text("Complete Data Report", 14, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yPos);
        yPos += 10;
        const keys = [
          "Gav dev Falni",
          "Mahit Fala",
          "Ganpati Vargani",
          "Navratri Vargani",
          "Holi Vargani",
        ];
        let grandTotal = 0;
        keys.forEach((key, index) => {
          let data = JSON.parse(localStorage.getItem(key)) || [];
          if (data.length === 0) return;
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          doc.setFontSize(14);
          doc.setTextColor(26, 188, 156);
          doc.text(`${index + 1}. ${key}`, 14, yPos);
          yPos += 6;
          let rows = [];
          let catTotal = 0;
          data.forEach((item) => {
            if (item.fala) catTotal += parseFloat(item.fala);
            rows.push([
              item.name,
              item.fala,
              item.date,
              item.year || item.contactOrFamily,
            ]);
          });
          doc.autoTable({
            startY: yPos,
            head: [["Name", "Amount", "Date", "Year/Family"]],
            body: rows,
            theme: "striped",
            headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255] },
            styles: { fontSize: 9 },
          });
          yPos = doc.lastAutoTable.finalY + 8;
          doc.setFontSize(11);
          doc.setTextColor(231, 76, 60);
          doc.text(`Subtotal: Rs. ${catTotal}`, 14, yPos);
          grandTotal += catTotal;
          yPos += 12;
        });
        if (yPos > 270) doc.addPage();
        doc.setFillColor(44, 62, 80);
        doc.rect(10, yPos, 190, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text(`GRAND TOTAL: Rs. ${grandTotal}`, 14, yPos + 10);
        doc.save("Kankradi_Full_Report.pdf");
        showNotification("Full Report Downloaded", "#2ed573");
      }

      // Games Logic
      let gameInterval = null;
      let animFrameId = null;
      let tttGameActive = false;
      let tttBoard = [];
      let tttCurrentPlayer = "X";
      let tttGameOver = false;
      let memoryCards = [];
      let memoryFlipped = [];
      let memoryMoves = 0;
      let memoryMatches = 0;
      let memoryCanClick = true;

      function stopGames() {
        if (gameInterval) {
          clearTimeout(gameInterval);
          gameInterval = null;
        }
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
        document.onkeydown = null;
        tttGameActive = false;
        memoryCanClick = false;
      }

      function showGames() {
        stopGames();
        document.getElementById("contentArea").innerHTML =
          `<h2 class="big-title">Play Games</h2><div class="game-grid"><div class="game-card" onclick="startTicTacToe()"><i class="fas fa-th" style="color:#8b5cf6;"></i><h3>Tic Tac Toe</h3><p>Classic X and O</p></div><div class="game-card" onclick="startSnake()"><i class="fas fa-worm" style="color:#10b981;"></i><h3>Snake</h3><p>Eat and Grow</p></div><div class="game-card" onclick="startMemory()"><i class="fas fa-brain" style="color:#3b82f6;"></i><h3>Memory</h3><p>Match Pairs</p></div><div class="game-card" onclick="startNumberGuess()"><i class="fas fa-question-circle" style="color:#0d9488;"></i><h3>Guess Num</h3><p>1 to 100</p></div><div class="game-card" onclick="startRPS()"><i class="fas fa-hand-paper" style="color:#f59e0b;"></i><h3>RPS</h3><p>Rock Paper Scissors</p></div><div class="game-card" onclick="startReaction()"><i class="fas fa-bolt" style="color:#ef4444;"></i><h3>Reaction</h3><p>Test Speed</p></div></div>`;
      }

      // 1. Tic Tac Toe
      function startTicTacToe() {
        stopGames();
        tttBoard = ["", "", "", "", "", "", "", "", ""];
        tttCurrentPlayer = "X";
        tttGameOver = false;
        tttGameActive = true;
        document.getElementById("contentArea").innerHTML =
          `<div id="gameArea"><div class="game-ui-bar"><span class="game-score">Player: <b id="tttTurn">X</b></span><button class="game-btn" onclick="showGames()"><i class="fas fa-arrow-left"></i> Back</button></div><div class="ttt-status" id="tttStatus">Your turn (X)</div><div class="ttt-board" id="tttBoard"></div><button class="game-btn" onclick="resetTTT()" style="margin-top:20px;"><i class="fas fa-redo"></i> New Game</button></div>`;
        renderTTTBoard();
      }
      function renderTTTBoard() {
        const board = document.getElementById("tttBoard");
        let html = "";
        for (let i = 0; i < 9; i++) {
          const cellValue = tttBoard[i];
          let cellClass = "ttt-cell";
          if (cellValue === "X") cellClass += " x disabled";
          else if (cellValue === "O") cellClass += " o disabled";
          if (tttGameOver) cellClass += " disabled";
          html += `<div class="${cellClass}" data-index="${i}" onclick="tttHandleClick(${i})">${cellValue}</div>`;
        }
        board.innerHTML = html;
      }
      function tttHandleClick(index) {
        if (tttBoard[index] !== "" || tttGameOver || tttCurrentPlayer !== "X")
          return;
        tttBoard[index] = "X";
        renderTTTBoard();
        const result = tttCheckWin();
        if (result) {
          tttGameOver = true;
          document.getElementById("tttStatus").innerText =
            result === "draw" ? "It's a Draw!" : `${result} Wins!`;
          return;
        }
        tttCurrentPlayer = "O";
        document.getElementById("tttTurn").innerText = "O";
        document.getElementById("tttStatus").innerText = "AI thinking...";
        setTimeout(tttAIMove, 500);
      }
      function tttAIMove() {
        if (tttGameOver) return;
        const emptyCells = [];
        for (let i = 0; i < 9; i++) {
          if (tttBoard[i] === "") emptyCells.push(i);
        }
        if (emptyCells.length === 0) return;
        let move =
          tttFindBestMove("O") ||
          tttFindBestMove("X") ||
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        tttBoard[move] = "O";
        renderTTTBoard();
        const result = tttCheckWin();
        if (result) {
          tttGameOver = true;
          document.getElementById("tttStatus").innerText =
            result === "draw" ? "It's a Draw!" : `${result} Wins!`;
          return;
        }
        tttCurrentPlayer = "X";
        document.getElementById("tttTurn").innerText = "X";
        document.getElementById("tttStatus").innerText = "Your turn (X)";
      }
      function tttFindBestMove(player) {
        const wins = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let combo of wins) {
          const [a, b, c] = combo;
          const cells = [tttBoard[a], tttBoard[b], tttBoard[c]];
          const playerCount = cells.filter((x) => x === player).length;
          const emptyCount = cells.filter((x) => x === "").length;
          if (playerCount === 2 && emptyCount === 1) {
            if (tttBoard[a] === "") return a;
            if (tttBoard[b] === "") return b;
            if (tttBoard[c] === "") return c;
          }
        }
        return null;
      }
      function tttCheckWin() {
        const wins = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let combo of wins) {
          const [a, b, c] = combo;
          if (
            tttBoard[a] &&
            tttBoard[a] === tttBoard[b] &&
            tttBoard[b] === tttBoard[c]
          ) {
            return tttBoard[a];
          }
        }
        return tttBoard.includes("") ? null : "draw";
      }
      function resetTTT() {
        tttBoard = ["", "", "", "", "", "", "", "", ""];
        tttCurrentPlayer = "X";
        tttGameOver = false;
        document.getElementById("tttTurn").innerText = "X";
        document.getElementById("tttStatus").innerText = "Your turn (X)";
        renderTTTBoard();
      }

      // 2. Snake
      let snakeDir = "RIGHT";
      let snakeScore = 0;
      function startSnake() {
        stopGames();
        snakeDir = "RIGHT";
        snakeScore = 0;
        document.getElementById("contentArea").innerHTML =
          `<div id="gameArea"><div class="game-ui-bar"><span class="game-score">Score: <b id="snakeScore">0</b></span><button class="game-btn" onclick="showGames()"><i class="fas fa-arrow-left"></i> Back</button></div><div class="snake-container"><canvas id="gameCanvas" class="snake-canvas" width="300" height="300"></canvas><div class="snake-controls"><button class="snake-ctrl-btn ctrl-up" ontouchstart="setSnakeDir('UP')" onclick="setSnakeDir('UP')"><i class="fas fa-chevron-up"></i></button><button class="snake-ctrl-btn ctrl-left" ontouchstart="setSnakeDir('LEFT')" onclick="setSnakeDir('LEFT')"><i class="fas fa-chevron-left"></i></button><button class="snake-ctrl-btn ctrl-right" ontouchstart="setSnakeDir('RIGHT')" onclick="setSnakeDir('RIGHT')"><i class="fas fa-chevron-right"></i></button><button class="snake-ctrl-btn ctrl-down" ontouchstart="setSnakeDir('DOWN')" onclick="setSnakeDir('DOWN')"><i class="fas fa-chevron-down"></i></button></div></div></div>`;
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        const box = 15;
        let snake = [{ x: 150, y: 150 }];
        let food = {
          x: Math.floor(Math.random() * 20) * box,
          y: Math.floor(Math.random() * 20) * box,
        };
        document.onkeydown = (e) => {
          const key = e.key;
          if ((key === "ArrowUp" || key === "w") && snakeDir !== "DOWN")
            snakeDir = "UP";
          else if ((key === "ArrowDown" || key === "s") && snakeDir !== "UP")
            snakeDir = "DOWN";
          else if ((key === "ArrowLeft" || key === "a") && snakeDir !== "RIGHT")
            snakeDir = "LEFT";
          else if ((key === "ArrowRight" || key === "d") && snakeDir !== "LEFT")
            snakeDir = "RIGHT";
        };
        window.setSnakeDir = (dir) => {
          if (dir === "UP" && snakeDir !== "DOWN") snakeDir = "UP";
          else if (dir === "DOWN" && snakeDir !== "UP") snakeDir = "DOWN";
          else if (dir === "LEFT" && snakeDir !== "RIGHT") snakeDir = "LEFT";
          else if (dir === "RIGHT" && snakeDir !== "LEFT") snakeDir = "RIGHT";
        };
        function draw() {
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(0, 0, 300, 300);
          ctx.strokeStyle = "rgba(255,255,255,0.03)";
          for (let i = 0; i <= 300; i += box) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 300);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(300, i);
            ctx.stroke();
          }
          snake.forEach((s, i) => {
            ctx.fillStyle = i === 0 ? "#10b981" : "#059669";
            ctx.fillRect(s.x + 1, s.y + 1, box - 2, box - 2);
          });
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(
            food.x + box / 2,
            food.y + box / 2,
            box / 2 - 2,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          let head = { x: snake[0].x, y: snake[0].y };
          if (snakeDir === "UP") head.y -= box;
          if (snakeDir === "DOWN") head.y += box;
          if (snakeDir === "LEFT") head.x -= box;
          if (snakeDir === "RIGHT") head.x += box;
          if (
            head.x < 0 ||
            head.x >= 300 ||
            head.y < 0 ||
            head.y >= 300 ||
            snake.some((s) => s.x === head.x && s.y === head.y)
          ) {
            showNotification(`Game Over! Score: ${snakeScore}`, "warning");
            stopGames();
            return;
          }
          snake.unshift(head);
          if (head.x === food.x && head.y === food.y) {
            snakeScore++;
            document.getElementById("snakeScore").innerText = snakeScore;
            food = {
              x: Math.floor(Math.random() * 20) * box,
              y: Math.floor(Math.random() * 20) * box,
            };
          } else {
            snake.pop();
          }
          gameInterval = setTimeout(() => requestAnimationFrame(draw), 120);
        }
        draw();
      }

      // 3. Memory Game
      function startMemory() {
        stopGames();
        const emojis = ["😀", "😎", "😂", "🥳", "😍", "🤔", "😴", "😡"];
        memoryCards = [...emojis, ...emojis];
        memoryCards.sort(() => Math.random() - 0.5);
        memoryFlipped = [];
        memoryMoves = 0;
        memoryMatches = 0;
        memoryCanClick = true;
        document.getElementById("contentArea").innerHTML =
          `<div id="gameArea"><div class="game-ui-bar"><span class="game-score">Moves: <b id="memMoves">0</b></span><button class="game-btn" onclick="showGames()"><i class="fas fa-arrow-left"></i> Back</button></div><div class="ttt-status" id="memStatus">Find all matching pairs!</div><div class="memory-board" id="memBoard"></div></div>`;
        renderMemoryBoard();
      }
      function renderMemoryBoard() {
        const board = document.getElementById("memBoard");
        let html = "";
        for (let i = 0; i < memoryCards.length; i++) {
          html += `<div class="memory-card" data-index="${i}" onclick="memoryHandleClick(${i})"></div>`;
        }
        board.innerHTML = html;
      }
      function memoryHandleClick(index) {
        if (!memoryCanClick) return;
        const card = document.querySelector(
          `.memory-card[data-index="${index}"]`,
        );
        if (
          !card ||
          card.classList.contains("flipped") ||
          card.classList.contains("matched")
        )
          return;
        card.classList.add("flipped");
        card.innerText = memoryCards[index];
        memoryFlipped.push(index);
        if (memoryFlipped.length === 2) {
          memoryCanClick = false;
          memoryMoves++;
          document.getElementById("memMoves").innerText = memoryMoves;
          const [first, second] = memoryFlipped;
          if (memoryCards[first] === memoryCards[second]) {
            document
              .querySelector(`.memory-card[data-index="${first}"]`)
              .classList.add("matched");
            document
              .querySelector(`.memory-card[data-index="${second}"]`)
              .classList.add("matched");
            memoryMatches++;
            memoryFlipped = [];
            memoryCanClick = true;
            if (memoryMatches === 8) {
              document.getElementById("memStatus").innerText =
                `You Win in ${memoryMoves} moves!`;
              showNotification("Congratulations! You Won!", "success");
            }
          } else {
            setTimeout(() => {
              const card1 = document.querySelector(
                `.memory-card[data-index="${first}"]`,
              );
              const card2 = document.querySelector(
                `.memory-card[data-index="${second}"]`,
              );
              if (card1) {
                card1.classList.remove("flipped");
                card1.innerText = "";
              }
              if (card2) {
                card2.classList.remove("flipped");
                card2.innerText = "";
              }
              memoryFlipped = [];
              memoryCanClick = true;
            }, 800);
          }
        }
      }

      // 4. Number Guess
      function startNumberGuess() {
        stopGames();
        let target = Math.floor(Math.random() * 100) + 1;
        let attempts = 0;
        document.getElementById("contentArea").innerHTML =
          `<div id="gameArea"><div class="game-ui-bar"><span class="game-score">Attempts: <b id="guessAttempts">0</b></span><button class="game-btn" onclick="showGames()"><i class="fas fa-arrow-left"></i> Back</button></div><div class="guess-container"><h3 style="color:#1e293b; margin:10px 0;">Guess a number between 1-100</h3><div class="guess-input-area"><input type="number" id="guessInput" class="guess-input" placeholder="?" min="1" max="100"><button class="game-btn" onclick="makeGuess()">Check</button></div><div id="guessResult"></div><div id="guessHistory" class="guess-history"></div><button class="game-btn" onclick="startNumberGuess()" style="margin-top:20px;"><i class="fas fa-redo"></i> New Game</button></div></div>`;
        window.makeGuess = () => {
          const val = document.getElementById("guessInput").value;
          if (!val) return;
          attempts++;
          document.getElementById("guessAttempts").innerText = attempts;
          const resDiv = document.getElementById("guessResult");
          const histDiv = document.getElementById("guessHistory");
          if (parseInt(val) === target) {
            resDiv.innerHTML = `<div class="guess-hint correct">Correct! You got it in ${attempts} tries!</div>`;
            showNotification("You Win!", "success");
          } else if (parseInt(val) > target) {
            resDiv.innerHTML = `<div class="guess-hint high">Too High! Try lower.</div>`;
            histDiv.innerHTML += `<div class="guess-history-item" style="color:#ef4444;">${val} ↓</div>`;
          } else {
            resDiv.innerHTML = `<div class="guess-hint low">Too Low! Try higher.</div>`;
            histDiv.innerHTML += `<div class="guess-history-item" style="color:#3b82f6;">${val} ↑</div>`;
          }
          document.getElementById("guessInput").value = "";
          document.getElementById("guessInput").focus();
        };
      }

      // 5. RPS
      function startRPS() {
        stopGames();
        let userScore = 0;
        let compScore = 0;
        document.getElementById("contentArea").innerHTML =
          `<div id="gameArea"><div class="game-ui-bar"><span class="game-score">Score</span><button class="game-btn" onclick="showGames()"><i class="fas fa-arrow-left"></i> Back</button></div><div class="rps-container"><div class="rps-score-board"><div class="rps-score-item"><div class="rps-score-num" id="rpsUser">0</div><div class="rps-score-label">You</div></div><div class="rps-score-item"><div class="rps-score-num" id="rpsComp">0</div><div class="rps-score-label">Computer</div></div></div><div class="rps-choices"><button class="rps-btn" onclick="playRPS('Rock')"><i class="fas fa-hand-rock"></i></button><button class="rps-btn" onclick="playRPS('Paper')"><i class="fas fa-hand-paper"></i></button><button class="rps-btn" onclick="playRPS('Scissors')"><i class="fas fa-hand-scissors"></i></button></div><div class="rps-result"><div class="rps-player"><div class="rps-player-icon" id="rpsUserIcon">?</div><small>You</small></div><div class="rps-vs">VS</div><div class="rps-player"><div class="rps-player-icon" id="rpsCompIcon">?</div><small>Computer</small></div></div><div id="rpsMessage"></div></div></div>`;
        window.playRPS = (user) => {
          const choices = ["Rock", "Paper", "Scissors"];
          const comp = choices[Math.floor(Math.random() * 3)];
          const icons = {
            Rock: "fa-hand-rock",
            Paper: "fa-hand-paper",
            Scissors: "fa-hand-scissors",
          };
          document.getElementById("rpsUserIcon").innerHTML =
            `<i class="fas ${icons[user]}"></i>`;
          document.getElementById("rpsCompIcon").innerHTML =
            `<i class="fas ${icons[comp]}"></i>`;
          const msg = document.getElementById("rpsMessage");
          if (user === comp) {
            msg.innerHTML = `<div class="rps-message draw">Draw!</div>`;
          } else if (
            (user === "Rock" && comp === "Scissors") ||
            (user === "Paper" && comp === "Rock") ||
            (user === "Scissors" && comp === "Paper")
          ) {
            msg.innerHTML = `<div class="rps-message win">You Win!</div>`;
            userScore++;
          } else {
            msg.innerHTML = `<div class="rps-message lose">You Lose!</div>`;
            compScore++;
          }
          document.getElementById("rpsUser").innerText = userScore;
          document.getElementById("rpsComp").innerText = compScore;
        };
      }

      // 6. Reaction
      function startReaction() {
        stopGames();
        let startTime;
        let timeout;
        let bestTime = Infinity;
        document.getElementById("contentArea").innerHTML =
          `<div id="gameArea"><div class="game-ui-bar"><span class="game-score">Best: <b id="reactBest">-</b> ms</span><button class="game-btn" onclick="showGames()"><i class="fas fa-arrow-left"></i> Back</button></div><div class="reaction-container"><div class="reaction-box wait" id="reactBox" onclick="reactClick()">Wait for Green</div><div style="font-size:14px; color:#64748b; margin-top:12px;">Click when it turns green!</div></div></div>`;
        function go() {
          const box = document.getElementById("reactBox");
          box.className = "reaction-box ready";
          box.innerText = "Click!";
          startTime = Date.now();
        }
        window.reactClick = () => {
          const box = document.getElementById("reactBox");
          if (box.classList.contains("ready")) {
            const time = Date.now() - startTime;
            box.className = "reaction-box result";
            box.innerHTML = `<div class="reaction-time">${time}ms</div>Click to retry`;
            if (time < bestTime) {
              bestTime = time;
              document.getElementById("reactBest").innerText = bestTime;
              showNotification("New Best Time!", "success");
            }
          } else if (
            box.classList.contains("result") ||
            box.classList.contains("early")
          ) {
            box.className = "reaction-box wait";
            box.innerText = "Wait...";
            timeout = setTimeout(go, Math.random() * 3000 + 2000);
          } else {
            clearTimeout(timeout);
            box.className = "reaction-box early";
            box.innerText = "Too Early! Click to retry";
          }
        };
        timeout = setTimeout(go, Math.random() * 3000 + 2000);
      }

      /* ===== THEME TOGGLE ===== */
      function setDark() {
        document.body.classList.add("dark-mode");
        localStorage.setItem("themeMode", "dark");
      }
      function setLight() {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("themeMode", "light");
      }
      window.onload = function () {
        let savedTheme = localStorage.getItem("themeMode");
        if (savedTheme === "dark") document.body.classList.add("dark-mode");
      };