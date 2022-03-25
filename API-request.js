function sendJSON(buttonType) {
    let url = "http://localhost:8080/complete"

    // var data = JSON.stringify(sendContext(buttonType, 12))
    var data = sendContext(buttonType, 12)
    let processedText = getSplitTextFromEditor(100)
    var x = document.getElementById("editor1-container");
    var y = x.contentWindow || x.contentDocument.document || x.contentDocument;
    y.document.open();
    processedText.split("\n###\n").forEach(section => {
        // if(section===""){return}
        let xhr = new XMLHttpRequest()
        // xhr.timeout = 10000
        xhr.open("POST", url, false)
        xhr.setRequestHeader("Content-Type", "application/json")
        data["context"]+="[Text]: "+section+"\n"+"[Summary]: "
        console.log(data["context"],"laude")
        if(section!==""){
            xhr.send(JSON.stringify(data));
        }
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = xhr.responseText
            let result = JSON.parse(response)["output"][0]["generated_text"].split("#")
            // write into result iframe
            y.document.write(result+"<br>");
            // remove first text and summary and append new result with its summary
            data["context"] = data["context"].split("\n###\n").slice(1,).join("\n###\n") + result + "\n###\n"
            console.log(data["context"])
        }else if(xhr.status!=200){
            
            console.log("Status code: "+xhr.status)
        }
    });
    y.document.close();
}

function sendContext(type, length) {
    let summaryLength = document.querySelector('input[name="val1"]:checked').value
    var text = document.getElementById("editor-container").textContent;
    let summaryType = {
        "Short": {
            "context": "[Text]: Punjab chief minister-designate Bhagwant Mann staked a claim on Saturday to form the next government in the state, while the Punjab police withdrew nearly 400 personnel providing security to 122 former MLAs, including former state cabinet ministers. However, security cover provided on court directions or on the basis of protectees’ threat perceptions will continue. I met the governor, handed over a letter of support from our MLAs, and staked claim… He accepted it and asked me wherever (sic) we wanted to hold the swearing-in ceremony,\" he said. Mann invited the people of the state to the function. Asked about his cabinet, Mann said the council of ministers would take historic decisions that had not been taken so far. Navjot Kaur Sidhu, the wife of Punjab Congress chief Navjot Singh Sidhu, who had a security detail of seven personnel, was also among the politicians whose security was reduced. Explaining the withdrawal of protection, Mann said, \"Police stations are lying vacant. We will seek only police work from the police force. I think the security of the people of Punjab is more important than the security of a few people.\n[Summary]: Bhagwant Mann is going to be Punjab's next CM. 122 MLAs have had their security detail reduced and Navjot Kaur Sidhu is among them.\n###\n",
            "temperature": 0.8,
            "max_length": 25,
            "end_sequence": "###",
            "return_full_text": false,
            "id":0
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