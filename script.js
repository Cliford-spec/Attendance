const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbyutbyoY5Y64Zt7uuUxGLrAhIwQYfTkbLovfaqhFfxGO08W1Y8Os3wJAfMHLTcZ_Lme/exec";


let scanned = false;


function onScanSuccess(decodedText, decodedResult) {

    if(scanned){
        return;
    }

    scanned = true;


    console.log("QR Code:", decodedText);


    document.getElementById("result").innerHTML =
    "Checking attendance...";


    let studentID = decodedText.trim();


    fetch(WEB_APP_URL + "?id=" + studentID)


    .then(response => response.json())


    .then(data => {


        if(data.success){


            let status = "";

            if(data.action === "timein"){
                status = "TIME IN SUCCESSFUL";
            }
            else if(data.action === "timeout"){
                status = "TIME OUT SUCCESSFUL";
            }


            document.getElementById("result").innerHTML = `

                <h2>${data.name}</h2>

                <h3>${status}</h3>

                <p>${data.time}</p>

            `;


        }
        else{


            document.getElementById("result").innerHTML = `

            <h3>${data.message}</h3>

            `;


        }


        // Allow next scan after 3 seconds
        setTimeout(()=>{
            scanned = false;
        },3000);



    })


    .catch(error=>{


        console.log(error);


        document.getElementById("result").innerHTML =
        "Connection Error";


        scanned = false;


    });


}



function onScanFailure(error){

    // Ignore scanning errors
}



const scanner = new Html5QrcodeScanner(

    "reader",

    {

        fps:10,

        qrbox:{
            width:250,
            height:250
        },

        rememberLastUsedCamera:true

    }

);


scanner.render(

    onScanSuccess,

    onScanFailure

);
