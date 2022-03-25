function sendJSON(buttonType) {
    console.log(buttonType)
    let url = "http://localhost:8080/complete"

    // var data = JSON.stringify(sendContext(buttonType, 12))
    var data = sendContext(buttonType, 12)
    let processedText = getSplitTextFromEditor(4)
    
    processedText.split("\n###\n").forEach(section => {
        let xhr = new XMLHttpRequest()
        xhr.open("POST", url, true)
        xhr.setRequestHeader("Content-Type", "application/json")

        var x = document.getElementById("editor1-container");
        var y = x.contentWindow || x.contentDocument.document || x.contentDocument;
        y.document.open();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // console.log("Fetching ...")
                let response = xhr.responseText
                console.log(response)
                let result = JSON.parse(response)["output"][0]["generated_text"].split("#")
                // write into result iframe
                
                y.document.write(result+"<br>");
                
                // remove first text and summary and append new result with its summary
                data["context"] = data["context"].split("\n###\n").slice(1,).join("\n###\n") +"[Text]: "+section+"\n"+"[Summary]: " + result + "\n###\n"
                console.log(data["context"])
            }else if(xhr.status!=200){
                alert("Server didn't respond!")
                console.log("Status code: "+xhr.status)
            }
        }
        xhr.send(JSON.stringify(data));
    });
    y.document.close();
}

function sendContext(type, length) {
    let summaryLength = document.querySelector('input[name="val1"]:checked').value
    var text = document.getElementById("editor-container").textContent;
    let summaryType = {
        "Short": {
            "context": "[Text]: Talking about her Australian Open triumph, world number one Naomi Osaka revealed she called her mother after giving interviews following her victory but she didn't even congratulate her. \"She just yelled at me to go to sleep. So I felt really loved,\" the 21-year-old added. Osaka is the first Asian tennis player to top the men's or women's rankings.\n[Summary]: Called mom after Aus Open win, she yelled at me to go sleep: Osaka\n###\n[Text]: The full cost of damage in Newton Stewart, one of the areas worst affected, is still being assessed. Repair work is ongoing in Hawick and many roads in Peeblesshire remain badly affected by standing water. Trains on the west coast mainline face disruption due to damage at the Lamington Viaduct. Many businesses and householders were affected by flooding in Newton Stewart after the River Cree overflowed into the town.\n[Summary]:Newton Stewart: Full cost of damage still being assessed\n###\n[Text]: First Minister Nicola Sturgeon visited the area to inspect the damage. The waters breached a retaining wall, flooding many commercial properties on Victoria Street - the main shopping thoroughfare. Jeanette Tate, who owns the Cinnamon Cafe which was badly affected, said she could not fault the multi-agency response once the flood hit.\n[Summary]: Nicola Sturgeon visited Newton Stewart to inspect flood damage\n###\n [Text]: However, she said more preventative work could have been carried out to ensure the retaining wall did not fail. \"It is difficult but I do think there is so much publicity for Dumfries and the Nith - and I totally appreciate that - but it is almost like we're neglected or forgotten,\" she said.\n[Summary]: Nicola Sturgeon said more preventative work could have been carried out to ensure the retaining wall did not fail\n###\n",
            "temperature": 0.9,
            "max_length": 25,
            "end_sequence": "###",
            "return_full_text": false
        },
        "Medium": {
            "context": "\n###\n[Original]: ",
            "temperature": 0.9,
            "max_length": 100,
            "end_sequence": "###",
            "return_full_text": false
        },
        "Long": {
            "context": "\n###\n[Original]: ",
            "temperature": 0.9,
            "max_length": 150,
            "end_sequence": "###",
            "return_full_text": false
        }
    }
    switch (type) {
        case "Summary":
            switch (summaryLength) {
                case "short":
                    var summary = summaryType["Short"]
                    // summary["context"] += text + "\n[Summary]:"
                    return summary
                case "medium":
                    var summary = summaryType["Medium"]
                    summary["context"] += text
                    return summary
                case "long":
                    var summary = summaryType["Long"]
                    summary["context"] += text
                    return summary
            }
            break;
        default:
            break;
    }
}

// TODO: Bracket check

function getSplitTextFromEditor(split_cnt) {
    let editor = document.getElementById("editor-container")
    editorArray = editor.contentWindow.document.body.innerText
    editorArray = editorArray.split(" ")
    console.log(editorArray)
    let finalResult = ""
    let resultText = ""
    let cur = 0;
    editorArray.forEach(word => {
        resultText += (" " + word)
        cur+=1
        if (word.includes(".") && cur >= split_cnt) {
            finalResult += resultText + "\n###\n"
            resultText = ""
            cur = 0
        }
    });
    return finalResult
}

// [Text]: abcd njnf djfn jndd.
// \n###\n
// jnnj jfdj sdlf sdfd. 
// \n###\n

// abcd njnf djfn jndd.