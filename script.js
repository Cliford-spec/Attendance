const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbyutbyoY5Y64Zt7uuUxGLrAhIwQYfTkbLovfaqhFfxGO08W1Y8Os3wJAfMHLTcZ_Lme/exec";

let scanned = false;

function clearDisplay() {
    document.getElementById("studentName").textContent = "";
    document.getElementById("action").textContent = "";
    document.getElementById("scanTime").textContent = "";
    document.getElementById("status").textContent = "";
    document.getElementById("result").textContent = "Waiting for scan...";
}

async function onScanSuccess(decodedText) {

    if (scanned) return;

    scanned = true;

    const studentID = decodedText.trim();

    document.getElementById("result").textContent = "Checking attendance...";

    try {

        const controller = new AbortController();

        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(
            WEB_APP_URL + "?id=" + encodeURIComponent(studentID),
            {
                signal: controller.signal
            }
        );

        clearTimeout(timeout);

        const data = await response.json();

        if (data.success) {

            document.getElementById("studentName").textContent = data.name;

            document.getElementById("action").textContent =
                data.action === "timein"
                ? "TIME IN SUCCESSFUL"
                : "TIME OUT SUCCESSFUL";

            document.getElementById("scanTime").textContent =
                data.time;

            document.getElementById("status").textContent =
                "STATUS: " + data.status;

            document.getElementById("result").textContent = "";

        } else {

            document.getElementById("studentName").textContent = "";

            document.getElementById("action").textContent = "";

            document.getElementById("scanTime").textContent = "";

            document.getElementById("status").textContent = "";

            document.getElementById("result").textContent =
                data.message;

        }

    } catch (err) {

        console.error(err);

        document.getElementById("result").textContent =
            "Unable to connect to the server.";

    }

    setTimeout(() => {

        scanned = false;

        clearDisplay();

    }, 3000);

}

function onScanFailure(error) {
    // Ignore continuous scan errors
}

const scanner = new Html5QrcodeScanner(
    "reader",
    {
        fps: 15,
        qrbox: {
            width: 250,
            height: 250
        },
        rememberLastUsedCamera: true,
        supportedScanTypes: [
            Html5QrcodeScanType.SCAN_TYPE_CAMERA,
            Html5QrcodeScanType.SCAN_TYPE_FILE
        ]
    },
    false
);

scanner.render(onScanSuccess, onScanFailure);
