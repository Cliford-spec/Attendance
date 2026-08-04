const WEB_APP_URL = 
"https://script.google.com/macros/s/AKfycbyutbyoY5Y64Zt7uuUxGLrAhIwQYfTkbLovfaqhFfxGO08W1Y8Os3wJAfMHLTcZ_Lme/exec";


function onScanSuccess(decodedText, decodedResult) {

    console.log("QR DATA:", decodedText);


    const qrData = decodedText.trim();


    if(qrData === ""){
        document.getElementById("result").innerHTML =
        "Invalid QR Code";
        return;
    }


    fetch(WEB_APP_URL + "?id=" + encodeURIComponent(qrData))
    .then(response => response.json())
    .then(data => {


        console.log(data);


        if(data.success){

            document.getElementById("result").innerHTML =
            `
            <h3>Attendance Recorded</h3>
            Name: ${data.name}<br>
            Action: ${data.action}<br>
            Time: ${data.time}
            `;

        }
        else{

            document.getElementById("result").innerHTML =
            data.message;

        }


    })
    .catch(error=>{

        console.log(error);

        document.getElementById("result").innerHTML =
        "Connection Error";

    });


}



const scanner = new Html5QrcodeScanner(
    "reader",
    {
        fps:10,
        qrbox:250
    }
);


scanner.render(
    onScanSuccess
);
