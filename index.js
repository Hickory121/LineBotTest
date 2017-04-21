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
      console.log('catch error');
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

////////////////////////////////////////
//////////////// 分析開始
////////////////////////////////////////
function parseInput(rplyToken, inputStr) {
          
		console.log('InputStr: ' + inputStr);
		_isNaN = function(obj) {
			return isNaN(parseInt(obj));
        }                   
        let msgSplitor = (/\S+/ig);	
		let mainMsg = inputStr.match(msgSplitor); //定義輸入字串
		let trigger = mainMsg[0].toString().toLowerCase(); //指定啟動詞在第一個詞&把大階強制轉成細階
                           
        

         //普通ROLL擲骰判定在此        
     if (inputStr.match(/\w/)!=null && inputStr.toLowerCase().match(/\d+d+\d/)!=null) {
          return nomalDiceRoller(inputStr,mainMsg[0],mainMsg[1],mainMsg[2]);
        }
	
}


////////////////////////////////////////
//////////////// 骰組開始
////////////////////////////////////////      
 
////////////////////////////////////////
//////////////// 普通ROLL
////////////////////////////////////////
 function nomalDiceRoller(inputStr,text0,text1,text2){
  
  //首先判斷是否是誤啟動（檢查是否有符合骰子格式）
 // if (inputStr.toLowerCase().match(/\d+d\d+/) == null) return undefined;
  
  //再來先把第一個分段拆出來，待會判斷是否是複數擲骰
  let mutiOrNot = text0.toLowerCase();
  
  //排除小數點
  if (mutiOrNot.toString().match(/\./)!=null)return undefined;

  //先定義要輸出的Str
  let finalStr = '' ;  
  
  
  //是複數擲骰喔
  if(mutiOrNot.toString().match(/\D/)==null ) {
	  if(text2 != null){
	  finalStr= text0 + '次擲骰：\n' + text1 +' ' + text2 + '\n';
    	  }
		  else{
		  finalStr= text0 + '次擲骰：\n' + text1 +'\n';
    		  }
    if(mutiOrNot>30) return '不支援30次以上的複數擲骰。';
    
    for (i=1 ; i<=mutiOrNot ;i++){
    let DiceToRoll = text1.toLowerCase();
    if (DiceToRoll.match('d') == null) return undefined;

    //寫出算式
    let equation = DiceToRoll;
    while(equation.match(/\d+d\d+/)!=null) {
      let tempMatch = equation.match(/\d+d\d+/);
      equation = equation.replace(/\d+d\d+/, RollDice(tempMatch));
    }

    //計算算式
    let aaa = equation;
	aaa = aaa.replace(/\d+[[]/ig, '(' );
	aaa = aaa.replace(/]/ig, ')' );
	//aaa = aaa.replace(/[[]\d+|]/ig, "");
	let answer = eval(aaa.toString());
	
    finalStr = finalStr + i + '# ' + equation + ' = ' + answer + '\n';
    }
        
  }
  
  else
  {
  //一般單次擲骰
  let DiceToRoll = mutiOrNot.toString().toLowerCase();
  DiceToRoll = DiceToRoll.toLowerCase();
  if (DiceToRoll.match('d') == null) return undefined;
  
  //寫出算式
  let equation = DiceToRoll;
  while(equation.match(/\d+d\d+/)!=null) {
	let totally = 0;
    let tempMatch = equation.match(/\d+d\d+/);    
    if (tempMatch.toString().split('d')[0]>300) return undefined;
    if (tempMatch.toString().split('d')[1]==1 || tempMatch.toString().split('d')[1]>1000000) return undefined;
    equation = equation.replace(/\d+d\d+/, RollDice(tempMatch));
	
  }
  
  //計算算式
	let aaa = equation;
	aaa = aaa.replace(/\d+[[]/ig, '(' );
	aaa = aaa.replace(/]/ig, ')' );
	let answer = eval(aaa.toString());
      
  if(text1 != null){
	  finalStr= text0 + '：' + text1 + '\n' + equation + ' = ' + answer;
    	  }
		  else{
		  finalStr= text0 + '：\n' + equation + ' = ' + answer;
    		  }

  }
  
  return finalStr;


}        


////////////////////////////////////////
//////////////// 擲骰子運算
////////////////////////////////////////

function sortNumber(a,b)
{
return a - b
}


        function Dice(diceSided){          
          return Math.floor((Math.random() * diceSided) + 1)
        }              
		
	function RollDice(inputStr){
  //先把inputStr變成字串（不知道為什麼非這樣不可）
  let comStr=inputStr.toString();
  let finalStr = '[';
  let temp = 0;
  var totally = 0;
  for (let i = 1; i <= comStr.split('d')[0]; i++) {
	temp = Dice(comStr.split('d')[1]);
	totally +=temp;
    finalStr = finalStr + temp + '+';
     }

  finalStr = finalStr.substring(0, finalStr.length - 1) + ']';
  finalStr = finalStr.replace('[', totally +'[');
  return finalStr;
}

function FunnyDice(diceSided) {
	return Math.floor((Math.random() * diceSided)) //猜拳，從0開始
}

function BuildDiceCal(inputStr){
  
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
    equation = equation.replace(/\d+d\d+/, BuildRollDice(tempMatch));
  }
  
  //計算算式
  let answer = eval(equation.toString());
    finalStr= equation + ' = ' + answer;
  
  return finalStr;

}        

function BuildRollDice(inputStr){
  //先把inputStr變成字串（不知道為什麼非這樣不可）
  let comStr=inputStr.toString().toLowerCase();
  let finalStr = '(';

  for (let i = 1; i <= comStr.split('d')[0]; i++) {
    finalStr = finalStr + Dice(comStr.split('d')[1]) + '+';
     }

  finalStr = finalStr.substring(0, finalStr.length - 1) + ')';
  return finalStr;
}
            

////////////////////////////////////////
//////////////// nechronica (NC)
////////////////////////////////////////
function nechronica(triggermsg ,text) {
	let returnStr = '';
	var ncarray = [];
	var dicemax = 0, dicemin = 0, dicenew = 0;

	var match = /^(\d+)(NC|NA)((\+|-)(\d+)|)$/i.exec(triggermsg);	//判斷式

	for (var i = 0; i < Number(match[1]); i++)	
	{
		dicenew = Dice(10) + Number(match[3]);
		ncarray.push(dicenew);
	}

	dicemax = Math.max(...ncarray);	//判斷最大最小值
	dicemin = Math.min(...ncarray);

	if (Number(match[1]) == 1)
		returnStr += dicemax + '[' + ncarray.pop() + ']'; 
	else
	{
		returnStr += dicemax + '[';
		for (i = 0; i < Number(match[1]); i++)
		{
			if (i != Number(match[1]) - 1)
				returnStr += ncarray.pop() + ',';
			else
				returnStr += ncarray.pop();
		}
		returnStr += ']';
	}

	if (dicemax > 5)
		if (dicemax > 10)
			returnStr += ' → 大成功';
		else
			returnStr += ' → 成功';
	else
		if (dicemin <= 1)
			returnStr += ' → 大失敗';
		else
			returnStr += ' → 失敗';

	if (text != null)
		returnStr += ' ; ' + text;

	return returnStr;
}

////////////////////////////////////////
//////////////// nechronica (NM依戀)
////////////////////////////////////////

function nechronica_mirenn(text) {
	let returnStr = '';
	var dicenew = 0;
	dicenew = Dice(10)-1;

	// 產生格式
	if (text != null)
		returnStr = text + ': \n' + '依戀 (' + (dicenew+1) + '[' + (dicenew+1) + ']) → ' + nechronica_mirenn_table(dicenew);
	else
		returnStr = '依戀 (' + (dicenew+1) + '[' + (dicenew+1) + ']) → ' + nechronica_mirenn_table(dicenew);

	return returnStr;
}

/* 這邊預留 mode 以便未來可以加入其他依戀 */
function nechronica_mirenn_table(mode) {
	if (mode == 0) returnStr = '【嫌惡】\n[發狂：敵對認識] 戰鬥中，沒有命中敵方的攻擊，全部都會擊中嫌惡的對象。(如果有在射程內的話)';
	if (mode == 1) returnStr = '【獨占】\n[發狂：獨占衝動] 戰鬥開始與戰鬥結束，各別選擇損傷1個對象的部件。';
	if (mode == 2) returnStr = '【依存】\n[發狂：幼兒退行] 妳的最大行動值減少2。';
	if (mode == 3) returnStr = '【執著】\n[發狂：跟蹤監視] 戰鬥開始與戰鬥結束時，對象對妳的依戀精神壓力點數各增加1點。(如果已經處在精神崩壞狀態，可以不用作此處理)';
	if (mode == 4) returnStr = '【戀心】\n[發狂：自傷行為] 戰鬥開始與戰鬥結束時，各別選擇損傷1個自己的部件。';
	if (mode == 5) returnStr = '【對抗】\n[發狂：過度競爭] 戰鬥開始與戰鬥結束時，各別選擇任意依戀，增加1點精神壓力點數。(如果已經處在精神崩壞狀態，可以不用作此處理)';
	if (mode == 6) returnStr = '【友情】\n[發狂：共鳴依存] 單元結束時，對象的損傷部件比妳還要多的時候，妳的部件損傷數，要增加到與對方相同。';
	if (mode == 7) returnStr = '【保護】\n[發狂：過度保護] 戰鬥當中，妳跟「依戀的對象」處於不同區域的時候，無法宣告「移動以外的戰鬥宣言」，此外妳沒有辦法把「自身」與「依戀對象」以外的單位當成移動對象。';
	if (mode == 8) returnStr = '【憧憬】\n[發狂：贗作妄想] 戰鬥當中，妳跟「依戀的對象」處於同樣區域的時候，無法宣告「移動以外的戰鬥宣言」，此外妳沒有辦法把「自身」與「依戀對象」以外的單位當成移動對象。';
	if (mode == 9) returnStr = '【信賴】\n[發狂：疑心暗鬼] 除了妳以外的所有姊妹，最大行動值減少1。';
	return returnStr;
}



////////////////////////////////////////
//////////////// D66
////////////////////////////////////////

function d66(text) {

	let returnStr = '';
	if(text != null){
	returnStr =   'D66：' + text + ' → ' + Dice(6) + Dice(6);
	}
	else{
	returnStr = 'D66 → ' + Dice(6) + Dice(6);
	}
	return returnStr;
	
}

////////////////////////////////////////
//////////////// D66s
////////////////////////////////////////

function d66s(text) {

	let temp0 = Dice(6);
	let temp1 = Dice(6);
	let returnStr = '';
	if (temp0>= temp1){
		let temp2 = temp0;
		temp0 = temp1;
		temp1 = temp2;
	}
	if(text != null){
	
	returnStr =   'D66s：' + text + ' → ' + temp0 + temp1;
	}
	else{
	returnStr = 'D66s → ' +  temp0 + temp1;
	}
	return returnStr;
	
}

////////////////////////////////////////
//////////////// xBy
////////////////////////////////////////
function xBy(triggermsg ,text01, text02) {

let returnStr = '(' + triggermsg +')';
let match = /^(\d+)(B)(\d+)$/i.exec(triggermsg);  //判斷式  [0]3B8,[1]3,[2]B,[3]8
let varcou =  new Array();
let varsu = 0;
for (var i = 0; i < Number(match[1]); i++)	
	{
             varcou[i] =  Dice(match[3]);
	}
varcou.sort(sortNumber);
//(5B7>6) → 7,5,6,4,4 → 成功数1

if(isNaN(text01) ==false &&Number(text01) <= Number(match[3]))
{
for (let i = 0; i < Number(match[1]); i++)	
	{
             if(Number(varcou[i])>=Number(text01)) varsu++;        
	}
	if (text02 ==undefined) text02 ='';

    returnStr+= ' → ' + varcou + ' → 成功數'+varsu + ' ' +text02 ;
	
}
else{
	if (text01 ==undefined) text01 ='';
	returnStr+=  ' → ' + varcou + ' ' +text01 ;

	}
	

return returnStr;
}

////////////////////////////////////////
//////////////// xUy
////////////////  (5U10[8]) → 17[10,7],4,5,7,4 → 17/37(最大/合計)
////////////////  (5U10[8]>8) → 1,30[9,8,8,5],1,3,4 → 成功数1
////////////////////////////////////////

function xUy(triggermsg ,text01, text02, text03) {
	var match = /^(\d+)(u)(\d+)/i.exec(triggermsg);   //判斷式  5u19,5,u,19, 
	var returnStr = '('+triggermsg+'['+text01+']';
	if(Number(text02) <= Number(match[3]) && text02 != undefined) 
	{
		returnStr+= '>'+text02+ ') → ';
		if(text03!=undefined) returnStr += text03 +' → ';
	}
	else{
	returnStr+= ') → ';
		if(text02!=undefined) returnStr += text02 +' → ';	
	}	
	let varcou =  new Array();
	let varcouloop =  new Array();
	let varcoufanl =  new Array();
	let varcounew =  new Array();
	var varsu = 0;
	if (text01<=2) { return  '加骰最少比2高'; }

for (var i = 0; i < Number(match[1]); i++)	
	{
			varcou[i] =  Dice(match[3]);
			varcounew[i] = varcou[i];
			varcouloop[i] = varcounew[i];
			for(;varcounew[i]>=text01;)
			{
				varcounew[i] =Dice(match[3]);
				varcouloop[i] += ', ' +varcounew[i];
				varcou[i] += varcounew[i];
			}

	}

    for(var i = 0; i < varcouloop.length; i++)	
  {
	if(varcouloop[i]==varcou[i])   {returnStr += varcou[i]+', ';}
    else     returnStr += varcou[i]+'['+varcouloop[i]+ '], '; 
    
  }
		returnStr = returnStr.replace(/, $/ig,'');
 
 
 
 if(Number(text02) <= Number(match[3]) ){
let suc =0;

////////////////  (5U10[8]>8) → 1,30[9,8,8,5],1,3,4 → 成功数1
for(var i=0;i<varcou.length;i++)
{
if(Number(varcou[i])>=Number(text02)) suc++;
}

returnStr  += ' → 成功数' +suc;

 }
 else
  ////////////////  (5U10[8]) → 17[10,7],4,5,7,4 → 17/37(最大/合計)

	 {
 returnStr  +=' → ' + Math.max.apply(null, varcou)
returnStr  += '/' + varcou.reduce(function(previousValue,currentValue){
        return previousValue + currentValue;} ) +'(最大/合計)';

	}
	return returnStr;
	
	}

