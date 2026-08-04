const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbyutbyoY5Y64Zt7uuUxGLrAhIwQYfTkbLovfaqhFfxGO08W1Y8Os3wJAfMHLTcZ_Lme/exec";


let isProcessing = false;

let html5QrcodeScanner;



function onScanSuccess(decodedText, decodedResult) {


    if(isProcessing){
        return;
    }


    isProcessing = true;


    let studentQR = decodedText.trim();


    console.log("QR DATA:", studentQR);



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
            Name: ${data.name}<br>
            Time: ${data.time}
            `;


        }
        else{


            document.getElementById("result").innerHTML =
            data.message;


        }




        // Wait 3 seconds then scan again

        setTimeout(()=>{


            isProcessing = false;


            document.getElementById("result").innerHTML =
            "Ready for next student";



            // Resume camera scanning

            html5QrcodeScanner.resume();



        },3000);



    })


    .catch(error=>{


        console.log(error);


        document.getElementById("result").innerHTML =
        "Connection Error";



        isProcessing = false;


        html5QrcodeScanner.resume();



    });



}






html5QrcodeScanner = new Html5QrcodeScanner(

    "reader",

    {
        fps:10,
        qrbox:250
    }

);



html5QrcodeScanner.render(

    onScanSuccess

);
