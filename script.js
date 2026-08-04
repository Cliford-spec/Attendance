const WEB_APP_URL = 
"https://script.google.com/macros/s/AKfycbyutbyoY5Y64Zt7uuUxGLrAhIwQYfTkbLovfaqhFfxGO08W1Y8Os3wJAfMHLTcZ_Lme/exec";


let scanned = false;


function onScanSuccess(decodedText, decodedResult) {


    // Prevent duplicate scans
    if(scanned){
        return;
    }


    scanned = true;


    console.log("QR DATA:", decodedText);



    const qrData = decodedText.trim();



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


        // STOP CAMERA AFTER SUCCESS
        html5QrcodeScanner.clear();


    })


    .catch(error=>{

        console.log(error);

        document.getElementById("result").innerHTML =
        "Connection Error";

        html5QrcodeScanner.clear();

    });


}



let html5QrcodeScanner = new Html5QrcodeScanner(

    "reader",
    {
        fps:10,
        qrbox:250
    }

);


html5QrcodeScanner.render(onScanSuccess);
