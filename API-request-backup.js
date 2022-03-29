function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function sendJSON(buttonType) {
    var x = document.getElementById("editor1-container");
    var y = x.contentWindow || x.contentDocument.document || x.contentDocument;
    // var y = x.contentDocument
    y.document.body.innerHTML = ""
    let url = "http://34.70.110.199:8080/complete"

    // var data = JSON.stringify(sendContext(buttonType, 12))
    var data = sendContext(buttonType, 12)
    let summaryLength = document.querySelector('input[name="val1"]:checked').value
    let processedText = getSplitTextFromEditor(250)
    if(summaryLength==="medium"){
        processedText = getSplitTextFromEditor(225)
    }
    if(summaryLength==="long"){
        processedText = getSplitTextFromEditor(175)
    }
    let index = 0;
    let interval = 1000;
    var x = document.getElementById("editor1-container");
    var y = x.contentWindow || x.contentDocument.document || x.contentDocument;
    var one="[Text]"
    var two="[Summary]"
    
    y.document.open();
    processedText.split("\n###\n").forEach(section => {
        setTimeout(function () {
            // if(section===""){return}
            let xhr = new XMLHttpRequest()
            // xhr.timeout = 10000
            xhr.open("POST", url, false)
            xhr.setRequestHeader("Content-Type", "application/json")
            data["context"]+=one+": "+section+"\n"+two+":"
            console.log(data["context"],"laude")
            xhr.send(JSON.stringify(data));
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = xhr.responseText
                let result = JSON.parse(response)["output"][0]["generated_text"]
                result = result.replace(new RegExp(escapeRegExp("#"), 'g'),"")
                result = result.replace(/\s\s+/g, ' ')
                result = result.replace(new RegExp(escapeRegExp("\n"), 'g'),"")
                // write into result iframe
                y.document.write(result+"<br>");
                // remove first text and summary and append new result with its summary
                data["context"] = data["context"].split("\n###\n").slice(1,).join("\n###\n") +" "+ result + "\n###\n"
                console.log(data["context"])
            }else if(xhr.status!=200){
                
                console.log("Status code: "+xhr.status)
            }
            
          }, index * interval);
        index+=1
    });
    y.document.close();
}
function sendJSON1(buttonType) {
    var x = document.getElementById("editor1-container");
    var y = x.contentWindow || x.contentDocument.document || x.contentDocument;
    // var y = x.contentDocument
    y.document.body.innerHTML = ""
    let url = "http://34.70.110.199:8080/complete"

    // var data = JSON.stringify(sendContext(buttonType, 12))
    var data = sendContext(buttonType, 12)
    let processedText = getSplitTextSentence()
    let index = 0;
    let interval = 1000;
    var x = document.getElementById("editor1-container");
    var y = x.contentWindow || x.contentDocument.document || x.contentDocument;
    y.document.write("")
    var one=""
    var two=""
    switch (buttonType) {
        case "Paraphrase":
            one="[Original]"
            two="[Paraphrase]"
            break;
        case "Grammar":
            one="[Original]"
            two="[Correction]"
            break;
        default:
            break;
    }
    y.document.open();
    processedText.split("\n###\n").forEach(section => {
        setTimeout(function () {
            // if(section===""){return}
            let xhr = new XMLHttpRequest()
            // xhr.timeout = 10000
            xhr.open("POST", url, false)
            xhr.setRequestHeader("Content-Type", "application/json")
            data["context"]+=one+": "+section+"\n"+two+":"
            xhr.send(JSON.stringify(data));
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = xhr.responseText
                let result = JSON.parse(response)["output"][0]["generated_text"]
                result = result.replace(new RegExp(escapeRegExp("#"), 'g'),"")
                result = result.replace(/\s\s+/g, ' ')
                result = result.replace(new RegExp(escapeRegExp("\n"), 'g'),"")
                // write into result iframe
                y.document.write(result);
            }else if(xhr.status!=200){
                console.log("Status code: "+xhr.status)
            }
            
          }, index * interval);
        index+=1
    });
    y.document.close();
}
function sendZeroShot() {
    var x = document.getElementById("editor1-container");
    var y = x.contentWindow || x.contentDocument.document || x.contentDocument;
    // var y = x.contentDocument
    y.document.body.innerHTML = ""
    let url = "http://34.70.110.199:8080/complete"
    // var data = JSON.stringify(sendContext(buttonType, 12))
    let editor = document.getElementById("editor-container")
    editorArray = editor.contentWindow.document.body.innerText
    editorArray = editorArray.trim()
    editorArray = editorArray.replace(/\s\s+/g, ' ');
    var x = document.getElementById("editor1-container");
    var y = x.contentWindow || x.contentDocument.document || x.contentDocument;
    y.document.open();
    let xhr = new XMLHttpRequest()
    xhr.open("POST", url, false)
    xhr.setRequestHeader("Content-Type", "application/json")
    var data = {
        "context":editorArray,
        "temperature": 0.9,
        "max_length": 100,
        "end_sequence": "###",
        "return_full_text": false,
        "id":0
    }
    xhr.send(JSON.stringify(data));
    if (xhr.readyState === 4 && xhr.status === 200) {
        let response = xhr.responseText
        let result = JSON.parse(response)["output"][0]["generated_text"]
        result = result.replace(new RegExp(escapeRegExp("#"), 'g'),"")
        result = result.replace(/\s\s+/g, ' ')
        result = result.replace(new RegExp(escapeRegExp("\n"), 'g'),"")
        // write into result iframe
        y.document.write(result);
    }else if(xhr.status!=200){
        console.log("Status code: "+xhr.status)
    }
    y.document.close();
}
function sendContext(type, length) {
    let summaryLength = document.querySelector('input[name="val1"]:checked').value
    var text = document.getElementById("editor-container").textContent;
    let summaryType = {
        "Short": {
            "context": "[Text]: State health inspectors ordered the immediate closure of local restaurant Pho Eva (648 Beal Parkway NW) on Jan. 13 based upon violations found during a routine inspection which \"endanger public health and safety,\" according to a report from the Department of Business and Professional Regulation.\nThere were four total violations found, including one high-priority violation.\nThe high-priority violation was for evidence of rodent activity in the restaurant — inspectors found approximately 244 rodent droppings spread across 12 different locations throughout the restaurant. \nThe three basic violations at Pho Eva were for a dead mouse/rat in a trap under the table to the left of the dish machine, boxes of food stored on floor in the walk-in freezer and an exterior door with a gap at the threshold that opens to the outside front door.\nThe restaurant was able to re-open on Jan. 14 when inspectors did a follow-up visit that met standards.\n[Summary]:If you're looking to eat at Pho Eva, don't. You might get food poisoning, or you might eat rat poop.\n###\n[Text]: With many countries around the world abandoning fossil fuels for renewable sources, what are countries to do with the now-toxic landscapes left behind? Norway has one very good idea. It’s turning the country’s last Arctic coal mine, located on the Svalbard archipelago between Norway and the North Pole, into a nearly 3,000-square-kilometre natural park. (The decades-old mine ceased operation in 2019.) Svalbard was already of vital ecological importance: 20 million birds nest on the islands during the late summer, while about 3,000 polar bears use its sea ice as prime hunting grounds. Now, the new Van Mijenfjorden National Park—named for one of Svalbard’s largest fjords—will unify this wilderness and, over time, return it to a pristine and well-managed state.\n[Summary]:Norway is turning an old coal mine into a natural park.\n###\n[Text]: In the heart of Berlin, a new place of worship will redefine the idea of sacred space. House of One is a new multifaith centre with the purpose of fostering community and dialogue. The building will house a church, a mosque and a synagogue in three separate sections linked by a communal domed hall in the middle. House of One will also be open to all other faiths, as well as secular society.\nReligious leaders from three communities—St. Petri-St. Marien Protestant Church, rabbinical seminary Abraham Geiger Kolleg and the Muslim founders of Forum Dialog—came together a decade ago to discuss their shared dream of a peace project in a time when religiously motivated attacks were on the rise.\n[Summary]:House of One is a new multifaith centre in Berlin that will house a church, a mosque and a synagogue.\n###\n",
            "temperature": 0.8,
            "max_length": 25,
            "end_sequence": "###",
            "return_full_text": false,
            "id":0
        },
        "Medium": {
            "context": "[Text]: State health inspectors ordered the immediate closure of local restaurant Pho Eva (648 Beal Parkway NW) on Jan. 13 based upon violations found during a routine inspection which \"endanger public health and safety,\" according to a report from the Department of Business and Professional Regulation.\nThere were four total violations found, including one high-priority violation.\nThe high-priority violation was for evidence of rodent activity in the restaurant — inspectors found approximately 244 rodent droppings spread across 12 different locations throughout the restaurant. \nThe three basic violations at Pho Eva were for a dead mouse/rat in a trap under the table to the left of the dish machine, boxes of food stored on floor in the walk-in freezer and an exterior door with a gap at the threshold that opens to the outside front door.\nThe restaurant was able to re-open on Jan. 14 when inspectors did a follow-up visit that met standards.\n[Summary]:A routine inspection of Pho Eva (648 Beal Parkway NW) revealed 244 rodent droppings and one dead mouse/rat in a trap. The restaurant was able to re-open when inspectors did a follow-up visit.\n###\n[Text]: With many countries around the world abandoning fossil fuels for renewable sources, what are countries to do with the now-toxic landscapes left behind? Norway has one very good idea. It’s turning the country’s last Arctic coal mine, located on the Svalbard archipelago between Norway and the North Pole, into a nearly 3,000-square-kilometre natural park. (The decades-old mine ceased operation in 2019.) Svalbard was already of vital ecological importance: 20 million birds nest on the islands during the late summer, while about 3,000 polar bears use its sea ice as prime hunting grounds. Now, the new Van Mijenfjorden National Park—named for one of Svalbard’s largest fjords—will unify this wilderness and, over time, return it to a pristine and well-managed state.\n[Summary]:Norway is turning an old coal mine into a natural park that will protect the land and its wildlife.\n###\n[Text]: In the heart of Berlin, a new place of worship will redefine the idea of sacred space. House of One is a new multifaith centre with the purpose of fostering community and dialogue. The building will house a church, a mosque and a synagogue in three separate sections linked by a communal domed hall in the middle. House of One will also be open to all other faiths, as well as secular society.\nReligious leaders from three communities—St. Petri-St. Marien Protestant Church, rabbinical seminary Abraham Geiger Kolleg and the Muslim founders of Forum Dialog—came together a decade ago to discuss their shared dream of a peace project in a time when religiously motivated attacks were on the rise.\n[Summary]:House of One is a new multifaith centre in Berlin that will house a church, a mosque and a synagogue. The building will also be open to all other faiths, as well as secular society.\n###\n",
            "temperature": 0.8,
            "max_length": 40,
            "end_sequence": "###",
            "return_full_text": false
        },
        "Long": {
            "context": "[Text]: State health inspectors ordered the immediate closure of local restaurant Pho Eva (648 Beal Parkway NW) on Jan. 13 based upon violations found during a routine inspection which \"endanger public health and safety,\" according to a report from the Department of Business and Professional Regulation.\nThere were four total violations found, including one high-priority violation.\nThe high-priority violation was for evidence of rodent activity in the restaurant — inspectors found approximately 244 rodent droppings spread across 12 different locations throughout the restaurant. \nThe three basic violations at Pho Eva were for a dead mouse/rat in a trap under the table to the left of the dish machine, boxes of food stored on floor in the walk-in freezer and an exterior door with a gap at the threshold that opens to the outside front door.\nThe restaurant was able to re-open on Jan. 14 when inspectors did a follow-up visit that met standards.\n[Summary]:Pho Eva, a local restaurant on Beal Parkway, was closed on Jan. 13 for having 244 rodent droppings in the restaurant and for a dead mouse/rat being found in a trap. The restaurant was able to re-open on Jan. 14 after meeting standards in a follow-up inspection.\n###\n[Text]: With many countries around the world abandoning fossil fuels for renewable sources, what are countries to do with the now-toxic landscapes left behind? Norway has one very good idea. It’s turning the country’s last Arctic coal mine, located on the Svalbard archipelago between Norway and the North Pole, into a nearly 3,000-square-kilometre natural park. (The decades-old mine ceased operation in 2019.) Svalbard was already of vital ecological importance: 20 million birds nest on the islands during the late summer, while about 3,000 polar bears use its sea ice as prime hunting grounds. Now, the new Van Mijenfjorden National Park—named for one of Svalbard’s largest fjords—will unify this wilderness and, over time, return it to a pristine and well-managed state.\n[Summary]:Norway is turning an old coal mine in the Arctic into a national park. The transition will take years, but it will eventually help restore the area to its natural state.\n###\n[Text]: In the heart of Berlin, a new place of worship will redefine the idea of sacred space. House of One is a new multifaith centre with the purpose of fostering community and dialogue. The building will house a church, a mosque and a synagogue in three separate sections linked by a communal domed hall in the middle. House of One will also be open to all other faiths, as well as secular society.\nReligious leaders from three communities—St. Petri-St. Marien Protestant Church, rabbinical seminary Abraham Geiger Kolleg and the Muslim founders of Forum Dialog—came together a decade ago to discuss their shared dream of a peace project in a time when religiously motivated attacks were on the rise.\n[Summary]:A new multifaith center called House of One will open in Berlin, Germany, with the purpose of fostering community and dialogue. The building will house a church, a mosque and a synagogue in three separate sections linked by a communal domed hall in the middle.\n###\n",
            "temperature": 0.8,
            "max_length": 80,
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
        case "Paraphrase":
            return "Original]: Algeria recalled its ambassador to Paris on Saturday and closed its airspace to French military planes a day later after the French president made comments about the northern Africa country.\n[Paraphrase]: Last Saturday, the Algerian government recalled its ambassador and stopped accepting French military airplanes in its airspace. It happened one day after the French president made comments about Algeria.\n###\n[Original]: President Macron was quoted as saying the former French colony was ruled by a \"political-military system\" with an official history that was based not on truth, but on hatred of France.\n[Paraphrase]: Emmanuel Macron said that the former colony was lying and angry at France. He also said that the country was ruled by a \"political-military system\.\n###\n[Original]: The diplomatic spat came days after France cut the number of visas it issues for citizens of Algeria and other North African countries.\n[Paraphrase]: Diplomatic issues started appearing when France decided to stop granting visas to Algerian people and other North African people.\n###\n"
        case "Grammar":
            return "Original]: I love goin to the beach.\n[Correction]: I love going to the beach.\n###\n[Original]: Let me hav it!\n[Correction]: Let me have it!\n###\n[Original]: It have too many drawbacks.\n[Correction]: It has too many drawbacks.\n###\n"
        default:
            break;
    }
}

// TODO: Bracket check

function getSplitTextFromEditor(split_cnt) {
    let editor = document.getElementById("editor-container")
    editorArray = editor.contentWindow.document.body.innerText
    editorArray = editorArray.trim()
    editorArray = editorArray.replace(/\s\s+/g, ' ');
    editorArray = editorArray.match(/\S.*?\."?(?=\s|$)/g)
    console.log(editorArray)
    let finalResult = ""
    let resultText = ""
    let cur = 0;
    editorArray.forEach(sentence => {
        resultText += (" " + sentence)
        cur+=sentence.split(" ").length
        if (cur >= split_cnt) {
            finalResult += resultText.trim() + "\n###\n"
            resultText = ""
            cur = 0
        }
    });
    if(resultText.trim()!=="")finalResult+=resultText.trim()+"\n###\n"
    return finalResult.slice(0,finalResult.length-5)
}
function getSplitTextSentence() {
    let editor = document.getElementById("editor-container")
    editorArray = editor.contentWindow.document.body.innerText
    editorArray = editorArray.trim()
    editorArray = editorArray.replace(/\s\s+/g, ' ');
    editorArray = editorArray.match(/\S.*?\."?(?=\s|$)/g)
    let finalResult = ""
    editorArray.forEach(sentence => {
        finalResult+=sentence.trim()+"\n###\n" 
    });
    return finalResult.slice(0,finalResult.length-5)
}

// [Text]: abcd njnf djfn jndd.
// \n###\n
// jnnj jfdj sdlf sdfd. 
// \n###\n

// abcd njnf djfn jndd.