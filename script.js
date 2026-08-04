const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbyutbyoY5Y64Zt7uuUxGLrAhIwQYfTkbLovfaqhFfxGO08W1Y8Os3wJAfMHLTcZ_Lme/exec";


let isProcessing = false;
let html5QrcodeScanner;



function onScanSuccess(decodedText, decodedResult) {


    // Prevent duplicate scanning
    if (isProcessing) {
        return;
    }


    isProcessing = true;


    const studentQR = decodedText.trim();


    console.log("QR DATA:", studentQR);



    // Stop scanner immediately
    html5QrcodeScanner.clear()
    .then(() => {
        console.log("Scanner stopped");
    })
    .catch(error => {
        console.log("Stop scanner error:", error);
    });



    if(studentQR === ""){


        document.getElementById("result").innerHTML =
        "Invalid QR Code";


        return;

    }



    fetch(
        WEB_APP_URL + "?id=" + encodeURIComponent(studentQR)
    )


    .then(response => response.json())


    .then(data => {


        console.log(data);



        if(data.success){


            document.getElementById("result").innerHTML =

            `
            <h3>Attendance Recorded</h3>

            <p>
            Name: ${data.name}<br>
            Action: ${data.action}<br>
            Time: ${data.time}
            </p>
            `;


        }

        else{


            document.getElementById("result").innerHTML =

            `
            <h3>${data.message}</h3>
            `;


        }


    })


    .catch(error => {


        console.log(error);


        document.getElementById("result").innerHTML =
        "Connection Error";


    });


}





// Initialize QR Scanner

html5QrcodeScanner = new Html5QrcodeScanner(

    "reader",

    {
        fps: 10,
        qrbox: 250
    }

);



// Start Scanner

html5QrcodeScanner.render(

    onScanSuccess

);
