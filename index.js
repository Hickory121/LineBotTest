var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');  
var app = express();

var jsonParser = bodyParser.json();

var options = {
  host: 'api.line.me',
  port: 443,
  path: '/v2/bot/message/reply',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ZzPWClo9RznMPxuRrnT+I288+nyNv5CNTzc30TVkMfVUZmxIiclVrEb23TwBUh4rYFFC4wVJOwbfE0AahXfMmm6bLMp6kPCTy9nNjiuWnFaQUVXmaA8wB1cpwmOoeH9A9kcn6ouAJ02d9cIQbvVCYwdB04t89/1O/w1cDnyilFU='
  }
}
app.set('port', (process.env.PORT || 5000));

// views is directory for all template files

app.get('/', function(req, res) {
//  res.send(parseInput(req.query.input));
  res.send('Hello');
});

app.post('/', jsonParser, function(req, res) {
  let event = req.body.events[0];
  let type = event.type;
  let msgType = event.message.type;
  let msg = event.message.text;
  let rplyToken = event.replyToken;

  let rplyVal = null;
  console.log(msg);
  if (type == 'message' && msgType == 'text') {
    try {
      rplyVal = parseInput(rplyToken, msg); 
    } 
    catch(e) {
      //rplyVal = randomReply();
      console.log('總之先隨便擺個跑到這邊的訊息，catch error');
    }
  }

  if (rplyVal) {
    replyMsgToLine(rplyToken, rplyVal); 
  } else {
    console.log('Do not trigger'); 
  }

  res.send('ok');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function replyMsgToLine(rplyToken, rplyVal) {
  let rplyObj = {
    replyToken: rplyToken,
    messages: [
      {
        type: "text",
        text: rplyVal
      }
    ]
  }

  let rplyJson = JSON.stringify(rplyObj); 
  
  var request = https.request(options, function(response) {
    console.log('Status: ' + response.statusCode);
    console.log('Headers: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function(body) {
      console.log(body); 
    });
  });
  request.on('error', function(e) {
    console.log('Request error: ' + e.message);
  })
  request.end(rplyJson);
}

function parseInput(rplyToken, inputStr) {
        console.log('InputStr: ' + inputStr);
        _isNaN = function(obj) {
         return isNaN(parseInt(obj));
        }                   
        //鴨霸獸指令開始於此

          if (inputStr.match('擲骰') != null) return YabasoReply(inputStr) ;
        else
        //cc判定在此
        if (inputStr.toLowerCase().match(/^cc/)!= null) return CoC7th(inputStr.toLowerCase()) ;      
        else
        //擲骰判定在此        
        if (inputStr.match(/\w/)!=null && inputStr.toLowerCase().match(/d/)!=null) {
          return nomalDiceRoller(inputStr);
        }
  
        
        else return undefined;
        
      }


        
function nomalDiceRoller(inputStr){
  
  //先定義要輸出的Str
  let finalStr = '' ;  
 //首先判斷是否是誤啟動（檢查是否有符合骰子格式）
  if (inputStr.toLowerCase().match(/\d+d\d+/) == null) return undefined;

  //再來先把第一個分段拆出來，待會判斷是否是複數擲骰
  let mutiOrNot = inputStr.toLowerCase().match(/\S+/);

  //排除小數點
  if (mutiOrNot.toString().match(/\./)!=null)return undefined;

  if(mutiOrNot.toString().match(/\D/)==null )  {
    finalStr= '複數擲骰：'
    if(mutiOrNot>20) return '不支援20次以上的複數擲骰。';

    for (i=1 ; i<=mutiOrNot ;i++){
      let DiceToRoll = inputStr.toLowerCase().split(' ',2)[1];
      if (DiceToRoll.match('d') == null) return undefined;
      finalStr = finalStr +'\n' + i + '# ' + DiceCal(DiceToRoll);
    }
    if(finalStr.match('200D')!= null) finalStr = '欸欸，不支援200D以上擲骰；哪個時候會骰到兩百次以上？想被淨灘嗎？';
    if(finalStr.match('D500')!= null) finalStr = '不支援D1和超過D500的擲骰；想被淨灘嗎？';
    
  } 
  
  else finalStr= '基本擲骰：' + DiceCal(mutiOrNot.toString());
  
  if (finalStr.match('NaN')!= null||finalStr.match('undefined')!= null) return undefined;
  return finalStr;
}
        
//作計算的函數
function DiceCal(inputStr){
  
  //首先判斷是否是誤啟動（檢查是否有符合骰子格式）
  if (inputStr.toLowerCase().match(/\d+d\d+/) == null) return undefined;
    
  //排除小數點
  if (inputStr.toString().match(/\./)!=null)return undefined;

  //先定義要輸出的Str
  let finalStr = '' ;  
  
  //一般單次擲骰
  let DiceToRoll = inputStr.toString().toLowerCase();  
  if (DiceToRoll.match('d') == null) return undefined;
  
  //寫出算式
  let equation = DiceToRoll;
  while(equation.match(/\d+d\d+/)!=null) {
    let tempMatch = equation.match(/\d+d\d+/);    
    if (tempMatch.toString().split('d')[0]>200) return '欸欸，不支援200D以上擲骰；哪個時候會骰到兩百次以上？想被淨灘嗎？';
    if (tempMatch.toString().split('d')[1]==1 || tempMatch.toString().split('d')[1]>500) return '不支援D1和超過D500的擲骰；想被淨灘嗎？';
    equation = equation.replace(/\d+d\d+/, RollDice(tempMatch));
  }
  
  //計算算式
  let answer = eval(equation.toString());
    finalStr= equation + ' = ' + answer;
  
  return finalStr;


}        

//用來把d給展開成算式的函數
function RollDice(inputStr){
  //先把inputStr變成字串（不知道為什麼非這樣不可）
  let comStr=inputStr.toString().toLowerCase();
  let finalStr = '(';

  for (let i = 1; i <= comStr.split('d')[0]; i++) {
    finalStr = finalStr + Dice(comStr.split('d')[1]) + '+';
     }

  finalStr = finalStr.substring(0, finalStr.length - 1) + ')';
  return finalStr;
}
                                                                     
      
               
function CoC7th(inputStr){
  
  //先判斷是不是要創角
  //這是悠子房規創角
  if (inputStr.toLowerCase().match('悠子創角') != null){
    let finalStr = '骰七次3D6取五次，\n決定STR、CON、DEX、APP、POW。\n';

    for (i=1 ; i<=7 ;i++){
      finalStr = finalStr +'\n' + i + '# ' + DiceCal('3d6*5');
    }

    finalStr = finalStr + '\n==';
    finalStr = finalStr +'\n骰四次2D6+6取三次，\n決定SIZ、INT、EDU。\n';

    for (i=1 ; i<=4 ;i++){
      finalStr = finalStr +'\n' + i + '# ' + DiceCal('(2d6+6)*5');
    }

    finalStr = finalStr + '\n==';
    finalStr = finalStr +'\n骰兩次3D6取一次，\n決定LUK。\n';
    for (i=1 ; i<=2 ;i++){
      finalStr = finalStr +'\n' + i + '# ' + DiceCal('3d6*5');
    } 

    return finalStr;
  }

  //這是傳統創角
  if (inputStr.toLowerCase().match('核心創角') != null){

    if (inputStr.split(' ' ).length != 3) return undefined;

    //讀取年齡
    let old = parseInt(inputStr.split(' ',3)[2]);
    if (old == NaN) return undefined;
    let ReStr = '調查員年齡設為：' + old + '\n';
    //設定 因年齡減少的點數 和 EDU加骰次數
    let Debuff = 0;
    let AppDebuff = 0;
    let EDUinc = 0;


    let oldArr = [15,20,40,50,60,70,80]
    let DebuffArr = [5,0,5,10,20,40,80]
    let AppDebuffArr = [0,0,5,10,15,20,25]
    let EDUincArr = [0,1,2,3,4,4,4]

    if (old < 15) return ReStr + '等等，核心規則不允許小於15歲的人物哦。';    
    if (old >= 90) return ReStr + '等等，核心規則不允許90歲以上的人物哦。'; 

    for ( i=0 ; old >= oldArr[i] ; i ++){
      Debuff = DebuffArr[i];
      AppDebuff = AppDebuffArr[i];
      EDUinc = EDUincArr[i];
    }

    ReStr = ReStr + '==\n';
    if (old < 20) ReStr = ReStr + '年齡調整：從STR、SIZ擇一減去' + Debuff + '點\n（請自行手動選擇計算）。\n將EDU減去5點。LUK可擲兩次取高。' ;
    else
      if (old >= 40)  ReStr = ReStr + '年齡調整：從STR、CON或DEX中「總共」減去' + Debuff + '點\n（請自行手動選擇計算）。\n將APP減去' + AppDebuff +'點。可做' + EDUinc + '次EDU的成長擲骰。' ;

    else ReStr = ReStr + '年齡調整：可做' + EDUinc + '次EDU的成長擲骰。' ;
    ReStr = ReStr + '\n==';
    if (old>=40) ReStr = ReStr + '\n（以下箭號三項，自選共減' + Debuff + '點。）' ;
    if (old<20) ReStr = ReStr + '\n（以下箭號兩項，擇一減去' + Debuff + '點。）' ;
    ReStr = ReStr + '\nＳＴＲ：' + DiceCal('3d6*5');
    if (old>=40) ReStr = ReStr + ' ← 共減' + Debuff ;
    if (old<20) ReStr = ReStr + ' ←擇一減' + Debuff ;
    ReStr = ReStr + '\nＣＯＮ：' + DiceCal('3d6*5');
    if (old>=40) ReStr = ReStr + ' ← 共減' + Debuff;
    ReStr = ReStr + '\nＤＥＸ：' + DiceCal('3d6*5');
    if (old>=40) ReStr = ReStr + ' ← 共減' + Debuff ;
    if (old>=40) ReStr = ReStr + '\nＡＰＰ：' + DiceCal('3d6*5-' + AppDebuff);
    else ReStr = ReStr + '\nＡＰＰ：' + DiceCal('3d6*5');
    ReStr = ReStr + '\nＰＯＷ：' + DiceCal('3d6*5');
    ReStr = ReStr + '\nＳＩＺ：' + DiceCal('(2d6+6)*5');
    if (old<20) ReStr = ReStr + ' ←擇一減' + Debuff ;
    ReStr = ReStr + '\nＩＮＴ：' + DiceCal('(2d6+6)*5');         
    if (old<20) ReStr = ReStr + '\nＥＤＵ：' + DiceCal('3d6*5-5');
    else {
      let firstEDU = '(' + RollDice('2d6') + '+6)*5';
      ReStr = ReStr + '\n==';
      ReStr = ReStr + '\nＥＤＵ初始值：' + firstEDU + ' = ' + eval(firstEDU);
      
      let tempEDU = eval(firstEDU);

      for (i = 1 ; i <= EDUinc ; i++){
        let EDURoll = Dice(100);
        ReStr = ReStr + '\n第' + i + '次EDU成長 → ' + EDURoll;


        if (EDURoll>tempEDU) {
          let EDUplus = Dice(10);
          ReStr = ReStr + ' → 成長' + EDUplus +'點';
          tempEDU = tempEDU + EDUplus;
        }
        else{
          ReStr = ReStr + ' → 沒有成長';       
        }
      }
      ReStr = ReStr + '\n';
      ReStr = ReStr + '\nＥＤＵ最終值：' +tempEDU;
    }
    ReStr = ReStr + '\n==';

    ReStr = ReStr + '\nＬＵＫ：' + DiceCal('3d6*5');    
    if (old<20) ReStr = ReStr + '\nＬＵＫ加骰：' + DiceCal('3D6*5');


    return ReStr;
  } 
  
  //隨機產生角色背景
  if (inputStr.toLowerCase().match('bg') != null){
    let PersonalDescriptionArr = ['結實的', '英俊的', '粗鄙的', '機靈的', '迷人的', '娃娃臉的', '聰明的', '蓬頭垢面的', '愚鈍的', '骯髒的', '耀眼的', '有書卷氣的','青春洋溢的','感覺疲憊的','豐滿的','粗壯的','毛髮茂盛的','苗條的','優雅的','邋遢的','敦實的','蒼白的','陰沉的','平庸的','臉色紅潤的','皮膚黝黑色','滿臉皺紋的','古板的','有狐臭的','狡猾的','健壯的','嬌俏的','筋肉發達的','魁梧的','遲鈍的', '虛弱的'];
    let IdeologyBeliefsArr = ['虔誠信仰著某個神祈','覺得人類不需要依靠宗教也可以好好生活','覺得科學可以解釋所有事，並對某種科學領域有獨特的興趣','相信因果循環與命運','是一個政黨、社群或秘密結社的成員','覺得這個社會已經病了，而其中某些病灶需要被剷除','是神秘學的信徒','是積極參與政治的人，有特定的政治立場','覺得金錢至上，且為了金錢不擇手段','是一個激進主義分子，活躍於社會運動'];
    let SignificantPeopleArr = ['他的父母', '他的祖父母', '他的兄弟姐妹', '他的孩子', '他的另一半', '那位曾經教導調查員最擅長的技能（點數最高的職業技能）的人','他的兒時好友', '他心目中的偶像或是英雄', '在遊戲中的另一位調查員', '一個由KP指定的NPC'];
    let SignificantPeopleWhyArr = ['調查員在某種程度上受了他的幫助，欠了人情','調查員從他那裡學到了些什麼重要的東西','他給了調查員生活的意義','調查員曾經傷害過他，尋求他的原諒','和他曾有過無可磨滅的經驗與回憶','調查員想要對他證明自己','調查員崇拜著他','調查員對他有著某些使調查員後悔的過往','調查員試圖證明自己和他不同，比他更出色','他讓調查員的人生變得亂七八糟，因此調查員試圖復仇'];
    let MeaningfulLocationsArr = ['過去就讀的學校','他的故鄉','與他的初戀之人相遇之處','某個可以安靜沉思的地方','某個類似酒吧或是熟人的家那樣的社交場所','與他的信念息息相關的地方','埋葬著某個對調查員別具意義的人的墓地','他從小長大的那個家','他生命中最快樂時的所在','他的工作場所'];
    let TreasuredPossessionsArr = ['一個與他最擅長的技能（點數最高的職業技能）相關的物品','一件他的在工作上需要用到的必需品','一個從他童年時就保存至今的寶物','一樣由調查員最重要的人給予他的物品','一件調查員珍視的蒐藏品','一件調查員無意間發現，但不知道到底是什麼的東西，調查員正努力尋找答案','某種體育用品','一把特別的武器','他的寵物'];
    let TraitsArr = ['慷慨大方的人','對動物很友善的人','善於夢想的人','享樂主義者','甘冒風險的賭徒或冒險者', '善於料理的人', '萬人迷','忠心耿耿的人','有好名聲的人','充滿野心的人'];
    
    return '背景描述生成器（僅供娛樂用，不具實際參考價值）\n==\n調查員是一個' + PersonalDescriptionArr[Math.floor((Math.random() * (PersonalDescriptionArr.length)) + 0)] + '人。\n【信念】：說到這個人，他' + IdeologyBeliefsArr[Math.floor((Math.random() * (IdeologyBeliefsArr.length)) + 0)] + '。\n【重要之人】：對他來說，最重要的人是' + SignificantPeopleArr[Math.floor((Math.random() * (SignificantPeopleArr.length)) + 0)] + '，這個人對他來說之所以重要，是因為' + SignificantPeopleWhyArr[Math.floor((Math.random() * (SignificantPeopleWhyArr.length)) + 0)] + '。\n【意義非凡之地】：對他而言，最重要的地點是' + MeaningfulLocationsArr[Math.floor((Math.random() * (MeaningfulLocationsArr.length)) + 0)] + '。\n【寶貴之物】：他最寶貴的東西就是'+ TreasuredPossessionsArr[Math.floor((Math.random() * (TreasuredPossessionsArr.length)) + 0)] + '。\n【特徵】：總括來說，調查員是一個' + TraitsArr[Math.floor((Math.random() * (TraitsArr.length)) + 0)] + '。';
    
  }
  
  //如果不是正確的格式，直接跳出
  if(inputStr.match('=') == null && inputStr.match('>') == null ) return undefined;
  
          //記錄檢定要求值
          let chack = parseInt(inputStr.split('=',2)[1]) ;
          //設定回傳訊息
          let ReStr = '(1D100<=' + chack + ') → ';

          //先骰兩次十面骰作為起始值
          let OneRoll = Dice(10) - 1;
          let TenRoll = Dice(10);
          let firstRoll = TenRoll*10 + OneRoll;
          if (firstRoll > 100) firstRoll = firstRoll - 100;  

          //先設定最終結果等於第一次擲骰
          let finalRoll = firstRoll;


          //判斷是否為成長骰
          if(inputStr.match(/^cc>\d+/)!=null){
            chack = parseInt(inputStr.split('>',2)[1]) ;
            if (finalRoll>chack) {

              ReStr = '(1D100>' + chack + ') → ' + finalRoll + ' → 成功成長' + Dice(10) +'點';
              return ReStr;
            }
            if (finalRoll<=chack) {
              ReStr = '(1D100>' + chack + ') → ' + finalRoll + ' → 沒有成長';
              return ReStr;
            }
            return undefined;
          }


          //判斷是否為獎懲骰
          let BPDice = 0;
          if(inputStr.match(/^cc\(-?[12]\)/)!=null) BPDice = parseInt(inputStr.split('(',2)[1]) ;
          //如果是獎勵骰
          if(BPDice != 0){
            let tempStr = firstRoll;
            for (let i = 1; i <= Math.abs(BPDice); i++ ){
              let OtherTenRoll = Dice(10);
              let OtherRoll = OtherTenRoll.toString() + OneRoll.toString();
              if (OtherRoll > 100) OtherRoll = parseInt(OtherRoll) - 100;  
              tempStr = tempStr + '、' + OtherRoll;
            }
            let countArr = tempStr.split('、');       
            if (BPDice>0) finalRoll = Math.min(...countArr);
            if (BPDice<0) finalRoll = Math.max(...countArr);

            ReStr = ReStr + tempStr + ' → ';      
          }  

          //結果判定
          if (finalRoll == 1) ReStr = ReStr + finalRoll + ' → 恭喜！大成功！';
          else
            if (finalRoll == 100) ReStr = ReStr + finalRoll + ' → 啊！大失敗！';
          else
            if (finalRoll <= 99 && finalRoll >= 95 && chack < 50) ReStr = ReStr + finalRoll + ' → 啊！大失敗！';
          else
            if (finalRoll <= chack/5) ReStr = ReStr + finalRoll + ' → 極限成功';
          else
            if (finalRoll <= chack/2) ReStr = ReStr + finalRoll + ' → 困難成功';
          else
            if (finalRoll <= chack) ReStr = ReStr + finalRoll + ' → 通常成功';
          else ReStr = ReStr + finalRoll + ' → 失敗' ;

          //浮動大失敗運算
          if (finalRoll <= 99 && finalRoll >= 95 && chack >= 50 ){
            if(chack/2 < 50) ReStr = ReStr + '\n（若要求困難成功則為大失敗）';
            else
              if(chack/5 < 50) ReStr = ReStr + '\n（若要求極限成功則為大失敗）';
          }  
          return ReStr;
}
 
  


function Dice(diceSided){          
          return Math.floor((Math.random() * diceSided) + 1)
        }              

 
  //以下是運勢功能
  if(inputStr.match('運勢') != null){
    let rplyArr=['超大吉','大吉','大吉','中吉','中吉','中吉','小吉','小吉','小吉','小吉','凶','凶','凶','大凶','大凶','你還是，不要知道比較好','這應該不關我的事'];
    return '運勢喔…我覺得，' + rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)] + '吧。';
  } 
  
  //沒有觸發關鍵字則是這個
  else{
    let rplyArr = ['\
還沒做好不能擲骰', '\
還沒做好不能擲骰'];
    return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
  }

}
