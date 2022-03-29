document.getElementById('copyToClipboard-a').addEventListener('click', function() {
  
    var text = document.getElementById('textA');
    text.select();
    document.execCommand('copy');
  
  })
  var text = document.getElementById('textA');
      text.innerHTML = "Message: Support has been terrible for 2 weeks...\nSentiment: Negative\n###\nMessage: I love your API, it is simple and so fast!\nSentiment: Positive\n###\nMessage: GPT-J has been released 2 months ago.\nSentiment: Neutral\n###\nMessage: The reactivity of your team has been amazing, thanks!\nSentiment:"
  document.getElementById('sentiment').addEventListener('click',function(){
      var text = document.getElementById('textA');
      text.innerHTML = "Message: Support has been terrible for 2 weeks...\nSentiment: Negative\n###\nMessage: I love your API, it is simple and so fast!\nSentiment: Positive\n###\nMessage: GPT-J has been released 2 months ago.\nSentiment: Neutral\n###\nMessage: The reactivity of your team has been amazing, thanks!\nSentiment:"
  })
  document.getElementById('classification').addEventListener('click',function(){
    var text = document.getElementById('textA');
    text.innerHTML = "Message: When the spaceship landed on Mars, the whole humanity was excited\nTopic: space\n###\nMessage: I love playing tennis and golf. I'm practicing twice a week.\nTopic: sport\n###\nMessage: Managing a team of sales people is a tough but rewarding job.\nTopic: business\n###\nMessage: I am trying to cook chicken with tomatoes.\nTopic:"
})
document.getElementById('paraphrase').addEventListener('click',function(){
    var text = document.getElementById('textA');
    text.innerHTML = "[Original]: Algeria recalled its ambassador to Paris on Saturday and closed its airspace to French military planes a day later after the French president made comments about the northern Africa country.\n[Paraphrase]: Last Saturday, the Algerian government recalled its ambassador and stopped accepting French military airplanes in its airspace. It happened one day after the French president made comments about Algeria.\n###\n[Original]: President Macron was quoted as saying the former French colony was ruled by a \"political-military system\" with an official history that was based not on truth, but on hatred of France.\n[Paraphrase]: Emmanuel Macron said that the former colony was lying and angry at France. He also said that the country was ruled by a \"political-military system\.\n###\n[Original]: The diplomatic spat came days after France cut the number of visas it issues for citizens of Algeria and other North African countries.\n[Paraphrase]: Diplomatic issues started appearing when France decided to stop granting visas to Algerian people and other North African people.\n###\n[Original]: After a war lasting 20 years, following the decision taken first by President Trump and then by President Biden to withdraw American troops, Kabul, the capital of Afghanistan, fell within a few hours to the Taliban, without resistance.\n[Paraphrase]:"
})
document.getElementById('grammar').addEventListener('click',function(){
    var text = document.getElementById('textA');
    text.innerHTML = "I love goin to the beach.\nCorrection: I love going to the beach.\n###\nLet me hav it!\nCorrection: Let me have it!\n###\nIt have too many drawbacks.\nCorrection: It has too many drawbacks.\n###\nI do not wan to go\nCorrection:"
})