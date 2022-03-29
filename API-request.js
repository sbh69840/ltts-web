function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
let sum_len = ["Long","Medium","Short"]
function sendJSON(buttonType) {
    var x = document.getElementById("editor1-container");
    var y = x.contentWindow || x.contentDocument.document || x.contentDocument;
    y.document.body.innerHTML = ""
    let url = "https://cors-anywhere.herokuapp.com/http://34.70.110.199:8080/complete"
    var data = sendContext(buttonType, 12)
    // let summaryLength = document.querySelector('input[name="val1"]:checked').value
    
    let index = 0;
    
    let interval = 500;
    
    
    let editor = document.getElementById("editor-container")
    var val = editor.contentWindow.document.body.innerText
    // y.document.open()
    // y1.document.open()
    sum_util(0,val,y,data,url)
    
    // y1.document.close();
    // y.document.close();
}
function sum_util(index,val,y,data,url){
    if(index==3)return
    let processedText = getSplitTextFromEditor(val,40)
    var cur = ""
    let len = processedText.split("\n###\n").length
    let ind = 0;
    y.document.write("<br><br>############<br>"+sum_len[index]+"<br>############<br><br>")
    processedText.split("\n###\n").forEach(section => {
    var one="[Text]"
    var two="[Summary]"
    tmp = {...data}
    tmp["context"]+=one+": "+section+"\n"+two+":"
    let xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
            let response = xhr.responseText
            let result = JSON.parse(response)["output"][0]["generated_text"]
            result = result.split("[Text]")[0]
            result = result.replace(new RegExp(escapeRegExp("#"), 'g'),"")
            result = result.replace(/\s\s+/g, ' ')
            result = result.replace(new RegExp(escapeRegExp("\n"), 'g'),"")
            cur+=result+". "
            y.document.write(result+". ");
            console.log("response: "+xhr.responseText);
            } else {
            console.error(xhr.statusText);
            }
            
        }
        ind+=1
        if(ind==len){
            val = cur.trim()
            console.log("gaand ",val) 
            sum_util(index+1,val,y,data,url)
        }
    };
    xhr.send(JSON.stringify(tmp));})
}
function sendJSON1(buttonType) {
    var x = document.getElementById("editor1-container");
    var y = x.contentWindow || x.contentDocument.document || x.contentDocument;
    // var y = x.contentDocument
    y.document.body.innerHTML = ""
    let url = "https://cors-anywhere.herokuapp.com/http://34.70.110.199:8080/complete"

    // var data = JSON.stringify(sendContext(buttonType, 12))
    var data = sendContext(buttonType, 12)
    let processedText = getSplitTextSentence()
    
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
    processedText.split("\n###\n").forEach(section => {
        tmp = {...data}
        tmp["context"]+=one+": "+section+"\n"+two+":"
        let xhr = new XMLHttpRequest()
        xhr.open("POST", url, true)
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                let response = xhr.responseText
                let result = JSON.parse(response)["output"][0]["generated_text"]
                result = result.split("[Text]")[0]
                result = result.replace(new RegExp(escapeRegExp("#"), 'g'),"")
                result = result.replace(/\s\s+/g, ' ')
                result = result.replace(new RegExp(escapeRegExp("\n"), 'g'),"")
                y.document.write(result+" ");
                console.log("response: "+xhr.responseText);
                } else {
                console.error(xhr.statusText);
                }
                
            }
        };
        xhr.send(JSON.stringify(tmp));
    })
}
function sendZeroShot() {
    var x = document.getElementById("editor1-container");
    var y = x.contentWindow || x.contentDocument.document || x.contentDocument;
    // var y = x.contentDocument
    y.document.body.innerHTML = ""
    let url = "https://cors-anywhere.herokuapp.com/http://34.70.110.199:8080/complete"
    // var data = JSON.stringify(sendContext(buttonType, 12))
    let editor = document.getElementById("editor-container")
    editorArray = editor.contentWindow.document.body.innerText
    editorArray = editorArray.trim()
    editorArray = editorArray.replace(/\s\s+/g, ' ');
    var data = {
        "context":editorArray,
        "temperature": 0.9,
        "max_length": 100,
        "end_sequence": "###",
        "return_full_text": false,
        "id":0
    }
    var x = document.getElementById("editor1-container");
    var y = x.contentWindow || x.contentDocument.document || x.contentDocument;
    let xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = xhr.responseText
                let result = JSON.parse(response)["output"][0]["generated_text"]
                result = result.split("[Text]")[0]
                result = result.replace(new RegExp(escapeRegExp("#"), 'g'),"")
                // result = result.replace(/\s\s+/g, ' ')
                result = result.replace(new RegExp(escapeRegExp("\n"), 'g'),"")
                y.document.body.innerHTML+=result+" ";
                console.log("response: "+xhr.responseText);
            } else {
                console.error(xhr.statusText);
            }
            
        }
    };
    xhr.send(JSON.stringify(data));
}
function sendContext(type, length) {
    // let summaryLength = document.querySelector('input[name="val1"]:checked').value
    // var text = document.getElementById("editor-container").textContent;
    // let summaryType = {
    //     "Short": {
    //         "context": "[Text]: Amid reports of CBFC raising an objection to three scenes and two dialogues in 'Thackeray', producer and Shiv Sena leader Sanjay Raut said, \"CBFC's scissors are a very small thing for Balasaheb Thackeray.\" Claiming the Hindi version of the film has been cleared by CBFC, Raut added, \"He (Thackeray) was the one who used to put the censor on others.\" \n[Summary]: CBFC's scissors very small thing for Thackeray: Sanjay Raut\n###\n[Text]: US-based Walmart which is in advanced talks to buy a significant stake in Flipkart is likely to get three to four seats on its 10-member board, according to reports. No substantial change is expected to take place at the top management level if the deal goes through. Walmart has reportedly offered $10-12 billion to buy a majority stake in Flipkart.\n[Summary]: Walmart to get 4 seats on Flipkart's 10-member board: Report\n###\n[Text]: Poland-born scientist Marie Curie, known for her discovery of radium and polonium, died on July 4, 1934, due to continued exposure to radiation. Unaware of ill-effects of radiation, Marie liked to keep radium by her bed as it shone in darkness. Marie and her husband Pierre Curie won the Physics Nobel in 1903 before her solo Chemistry Nobel in 1911.\n[Summary]: Marie Curie unknowingly died due to her own discovery\n###\n[Text]: Kapil Sharma, while talking about the ongoing controversy surrounding him wherein he abused SpotboyE editor Vickey Lalwani, said, \"We all have our way of expressing anger. I do it with gaalis.\" Kapil had abused Lalwani in a tweet, which was later deleted and also abused him on a phone call, accusing him of starting a false propaganda to defame him.\n[Summary]: People express anger differently, I do it with gaalis: Kapil\n###\n[Text]: Plus-size blogger Callie Thorpe has slammed people for posting abusive comments on a picture which showed her wearing a bikini. She posted a video titled 'Dealing with abuse', in which she has spoken about how she felt after reading those comments. \"You don't know how much these things hurt people... and it's not acceptable,\" she said in the video.\n[Summary]: Blogger slams people for abusive comments on bikini pic\n###\n[Text]: Former chief of the Indian Space Research Organisation (ISRO), Udupi Ramachandra Rao, passed away at about 2:30 am today, aged 85. He served as ISRO's chief from 1984 to 1994 and is widely known as the man behind India's first satellite Aryabhatta. He was awarded India's second-highest civilian honour, the Padma Vibhushan by the government in 2017.\n[Summary]: UR Rao, man behind India's first satellite passes away at 85\n###\n[Text]: Social media giant Facebook has disabled the feature which allowed users to search for other people by their phone numbers or email addresses. The company also revealed in a blog post that the recent data controversy may have exposed 87 million individuals' data. Facebook will also reduce the SMS data and call history collected from Android phones.\n[Summary]: Facebook disallows searching for users by phone number\n###\n[Text]: Amitabh Bachchan apologised to Dinesh Karthik for an error in his tweet congratulating the wicketkeeper and Team India for winning the T20I tri-series on Sunday. India needed 34 runs in last two overs of the final but Bachchan mistakenly tweeted that India required 24 runs. Last week, he had apologised for an error in a tweet on women's team's win.\n[Summary]: Big B apologises to Karthik over error in tweet praising him\n###\n[Text]: Veteran fast bowler Ashish Nehra will reportedly retire from international cricket after the first T20I against New Zealand in Delhi on November 1. The 38-year-old, who debuted for India in 1999, has represented the national team in 17 Tests, 120 ODIs and 26 T20Is and has taken 235 wickets. Nehra was also a part of the 2011 World Cup-winning squad.\n[Summary]: Ashish Nehra to retire from international cricket: Reports\n###\n[Text]: The Karnataka Co-operative Milk Producer's Federation (KMF) will reportedly axe 1,500 trees in Bengaluru's Hesaraghatta area in order to clear the space for the construction of a research farm. Stating that grass will be grown on 75 acres of the sanctioned land, KMF Joint Director B Mayanna said that the axed trees will be replanted in other areas.\n[Summary]: 1,500 trees to be axed in K'taka to clear space for a farm\n###\n",
    //         "temperature": 0.8,
    //         "max_length": 25,
    //         "end_sequence": "###",
    //         "return_full_text": false,
    //         "id":0
    //     },
    //     "Medium": {
    //         "context": "[Text]: State health inspectors ordered the immediate closure of local restaurant Pho Eva (648 Beal Parkway NW) on Jan. 13 based upon violations found during a routine inspection which \"endanger public health and safety,\" according to a report from the Department of Business and Professional Regulation.\nThere were four total violations found, including one high-priority violation.\nThe high-priority violation was for evidence of rodent activity in the restaurant — inspectors found approximately 244 rodent droppings spread across 12 different locations throughout the restaurant. \nThe three basic violations at Pho Eva were for a dead mouse/rat in a trap under the table to the left of the dish machine, boxes of food stored on floor in the walk-in freezer and an exterior door with a gap at the threshold that opens to the outside front door.\nThe restaurant was able to re-open on Jan. 14 when inspectors did a follow-up visit that met standards.\n[Summary]:A routine inspection of Pho Eva (648 Beal Parkway NW) revealed 244 rodent droppings and one dead mouse/rat in a trap. The restaurant was able to re-open when inspectors did a follow-up visit.\n###\n[Text]: With many countries around the world abandoning fossil fuels for renewable sources, what are countries to do with the now-toxic landscapes left behind? Norway has one very good idea. It’s turning the country’s last Arctic coal mine, located on the Svalbard archipelago between Norway and the North Pole, into a nearly 3,000-square-kilometre natural park. (The decades-old mine ceased operation in 2019.) Svalbard was already of vital ecological importance: 20 million birds nest on the islands during the late summer, while about 3,000 polar bears use its sea ice as prime hunting grounds. Now, the new Van Mijenfjorden National Park—named for one of Svalbard’s largest fjords—will unify this wilderness and, over time, return it to a pristine and well-managed state.\n[Summary]:Norway is turning an old coal mine into a natural park that will protect the land and its wildlife.\n###\n[Text]: In the heart of Berlin, a new place of worship will redefine the idea of sacred space. House of One is a new multifaith centre with the purpose of fostering community and dialogue. The building will house a church, a mosque and a synagogue in three separate sections linked by a communal domed hall in the middle. House of One will also be open to all other faiths, as well as secular society.\nReligious leaders from three communities—St. Petri-St. Marien Protestant Church, rabbinical seminary Abraham Geiger Kolleg and the Muslim founders of Forum Dialog—came together a decade ago to discuss their shared dream of a peace project in a time when religiously motivated attacks were on the rise.\n[Summary]:House of One is a new multifaith centre in Berlin that will house a church, a mosque and a synagogue. The building will also be open to all other faiths, as well as secular society.\n###\n",
    //         "temperature": 0.8,
    //         "max_length": 40,
    //         "end_sequence": "###",
    //         "return_full_text": false
    //     },
    //     "Long": {
    //         "context": "[Text]: State health inspectors ordered the immediate closure of local restaurant Pho Eva (648 Beal Parkway NW) on Jan. 13 based upon violations found during a routine inspection which \"endanger public health and safety,\" according to a report from the Department of Business and Professional Regulation.\nThere were four total violations found, including one high-priority violation.\nThe high-priority violation was for evidence of rodent activity in the restaurant — inspectors found approximately 244 rodent droppings spread across 12 different locations throughout the restaurant. \nThe three basic violations at Pho Eva were for a dead mouse/rat in a trap under the table to the left of the dish machine, boxes of food stored on floor in the walk-in freezer and an exterior door with a gap at the threshold that opens to the outside front door.\nThe restaurant was able to re-open on Jan. 14 when inspectors did a follow-up visit that met standards.\n[Summary]:Pho Eva, a local restaurant on Beal Parkway, was closed on Jan. 13 for having 244 rodent droppings in the restaurant and for a dead mouse/rat being found in a trap. The restaurant was able to re-open on Jan. 14 after meeting standards in a follow-up inspection.\n###\n[Text]: With many countries around the world abandoning fossil fuels for renewable sources, what are countries to do with the now-toxic landscapes left behind? Norway has one very good idea. It’s turning the country’s last Arctic coal mine, located on the Svalbard archipelago between Norway and the North Pole, into a nearly 3,000-square-kilometre natural park. (The decades-old mine ceased operation in 2019.) Svalbard was already of vital ecological importance: 20 million birds nest on the islands during the late summer, while about 3,000 polar bears use its sea ice as prime hunting grounds. Now, the new Van Mijenfjorden National Park—named for one of Svalbard’s largest fjords—will unify this wilderness and, over time, return it to a pristine and well-managed state.\n[Summary]:Norway is turning an old coal mine in the Arctic into a national park. The transition will take years, but it will eventually help restore the area to its natural state.\n###\n[Text]: In the heart of Berlin, a new place of worship will redefine the idea of sacred space. House of One is a new multifaith centre with the purpose of fostering community and dialogue. The building will house a church, a mosque and a synagogue in three separate sections linked by a communal domed hall in the middle. House of One will also be open to all other faiths, as well as secular society.\nReligious leaders from three communities—St. Petri-St. Marien Protestant Church, rabbinical seminary Abraham Geiger Kolleg and the Muslim founders of Forum Dialog—came together a decade ago to discuss their shared dream of a peace project in a time when religiously motivated attacks were on the rise.\n[Summary]:A new multifaith center called House of One will open in Berlin, Germany, with the purpose of fostering community and dialogue. The building will house a church, a mosque and a synagogue in three separate sections linked by a communal domed hall in the middle.\n###\n",
    //         "temperature": 0.8,
    //         "max_length": 80,
    //         "end_sequence": "###",
    //         "return_full_text": false
    //     }
    // }
    switch (type) {
        case "Summary":
            return {
                    "context": "[Text]: Amid reports of CBFC raising an objection to three scenes and two dialogues in 'Thackeray', producer and Shiv Sena leader Sanjay Raut said, \"CBFC's scissors are a very small thing for Balasaheb Thackeray.\" Claiming the Hindi version of the film has been cleared by CBFC, Raut added, \"He (Thackeray) was the one who used to put the censor on others.\" \n[Summary]: CBFC's scissors very small thing for Thackeray: Sanjay Raut\n###\n[Text]: US-based Walmart which is in advanced talks to buy a significant stake in Flipkart is likely to get three to four seats on its 10-member board, according to reports. No substantial change is expected to take place at the top management level if the deal goes through. Walmart has reportedly offered $10-12 billion to buy a majority stake in Flipkart.\n[Summary]: Walmart to get 4 seats on Flipkart's 10-member board: Report\n###\n[Text]: Poland-born scientist Marie Curie, known for her discovery of radium and polonium, died on July 4, 1934, due to continued exposure to radiation. Unaware of ill-effects of radiation, Marie liked to keep radium by her bed as it shone in darkness. Marie and her husband Pierre Curie won the Physics Nobel in 1903 before her solo Chemistry Nobel in 1911.\n[Summary]: Marie Curie unknowingly died due to her own discovery\n###\n[Text]: Kapil Sharma, while talking about the ongoing controversy surrounding him wherein he abused SpotboyE editor Vickey Lalwani, said, \"We all have our way of expressing anger. I do it with gaalis.\" Kapil had abused Lalwani in a tweet, which was later deleted and also abused him on a phone call, accusing him of starting a false propaganda to defame him.\n[Summary]: People express anger differently, I do it with gaalis: Kapil\n###\n[Text]: Plus-size blogger Callie Thorpe has slammed people for posting abusive comments on a picture which showed her wearing a bikini. She posted a video titled 'Dealing with abuse', in which she has spoken about how she felt after reading those comments. \"You don't know how much these things hurt people... and it's not acceptable,\" she said in the video.\n[Summary]: Blogger slams people for abusive comments on bikini pic\n###\n[Text]: Former chief of the Indian Space Research Organisation (ISRO), Udupi Ramachandra Rao, passed away at about 2:30 am today, aged 85. He served as ISRO's chief from 1984 to 1994 and is widely known as the man behind India's first satellite Aryabhatta. He was awarded India's second-highest civilian honour, the Padma Vibhushan by the government in 2017.\n[Summary]: UR Rao, man behind India's first satellite passes away at 85\n###\n[Text]: Social media giant Facebook has disabled the feature which allowed users to search for other people by their phone numbers or email addresses. The company also revealed in a blog post that the recent data controversy may have exposed 87 million individuals' data. Facebook will also reduce the SMS data and call history collected from Android phones.\n[Summary]: Facebook disallows searching for users by phone number\n###\n[Text]: Amitabh Bachchan apologised to Dinesh Karthik for an error in his tweet congratulating the wicketkeeper and Team India for winning the T20I tri-series on Sunday. India needed 34 runs in last two overs of the final but Bachchan mistakenly tweeted that India required 24 runs. Last week, he had apologised for an error in a tweet on women's team's win.\n[Summary]: Big B apologises to Karthik over error in tweet praising him\n###\n[Text]: Veteran fast bowler Ashish Nehra will reportedly retire from international cricket after the first T20I against New Zealand in Delhi on November 1. The 38-year-old, who debuted for India in 1999, has represented the national team in 17 Tests, 120 ODIs and 26 T20Is and has taken 235 wickets. Nehra was also a part of the 2011 World Cup-winning squad.\n[Summary]: Ashish Nehra to retire from international cricket: Reports\n###\n[Text]: The Karnataka Co-operative Milk Producer's Federation (KMF) will reportedly axe 1,500 trees in Bengaluru's Hesaraghatta area in order to clear the space for the construction of a research farm. Stating that grass will be grown on 75 acres of the sanctioned land, KMF Joint Director B Mayanna said that the axed trees will be replanted in other areas.\n[Summary]: 1,500 trees to be axed in K'taka to clear space for a farm\n###\n",
                    "temperature": 0.8,
                    "max_length": 25,
                    "end_sequence": "###",
                    "return_full_text": false,
                    "id":0
                }
        case "Paraphrase":
            return {
                    "context": "[Original]: Algeria recalled its ambassador to Paris on Saturday and closed its airspace to French military planes a day later after the French president made comments about the northern Africa country.\n[Paraphrase]: Last Saturday, the Algerian government recalled its ambassador and stopped accepting French military airplanes in its airspace. It happened one day after the French president made comments about Algeria.\n###\n[Original]: President Macron was quoted as saying the former French colony was ruled by a \"political-military system\" with an official history that was based not on truth, but on hatred of France.\n[Paraphrase]: Emmanuel Macron said that the former colony was lying and angry at France. He also said that the country was ruled by a \"political-military system\.\n###\n[Original]: The diplomatic spat came days after France cut the number of visas it issues for citizens of Algeria and other North African countries.\n[Paraphrase]: Diplomatic issues started appearing when France decided to stop granting visas to Algerian people and other North African people.\n###\n",
                    "temperature": 0.8,
                    "max_length": 25,
                    "end_sequence": "###",
                    "return_full_text": false,
                    "id":0
                }
        case "Grammar":
            return {
                "context": "[Original]: I love goin to the beach.\n[Correction]: I love going to the beach.\n###\n[Original]: Let me hav it!\n[Correction]: Let me have it!\n###\n[Original]: It have too many drawbacks.\n[Correction]: It has too many drawbacks.\n###\n",
                "temperature": 0.8,
                "max_length": 25,
                "end_sequence": "###",
                "return_full_text": false,
                "id":0
            }
        default:
            break;
    }
}

// TODO: Bracket check

function getSplitTextFromEditor(editorArray,split_cnt) {
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
