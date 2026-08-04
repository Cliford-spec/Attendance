const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbyutbyoY5Y64Zt7uuUxGLrAhIwQYfTkbLovfaqhFfxGO08W1Y8Os3wJAfMHLTcZ_Lme/exec";



let isProcessing = false;

let html5QrcodeScanner;




function onScanSuccess(decodedText, decodedResult) {



    // Prevent duplicate scans

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



            document.getElementById("studentName").innerHTML =
            "Name: " + data.name;



            document.getElementById("action").innerHTML =
            "Action: " + data.action;



            document.getElementById("scanTime").innerHTML =
            "Time: " + data.time;



            document.getElementById("status").innerHTML =
            "Status: Present";



            document.getElementById("result").innerHTML =
            "Attendance Recorded";



        }



        else {



            document.getElementById("result").innerHTML =
            data.message;



        }





        // Allow next scan after 3 seconds

        setTimeout(function(){



            isProcessing = false;



            document.getElementById("result").innerHTML =
            "Ready for next student";



            // Resume scanner

            try {

                html5QrcodeScanner.resume();

            }

            catch(error){

                console.log(error);

            }



        },3000);





    })



    .catch(error => {



        console.log(error);



        document.getElementById("result").innerHTML =
        "Connection Error";



        isProcessing = false;



        try {

            html5QrcodeScanner.resume();

        }

        catch(error){

            console.log(error);

        }



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
