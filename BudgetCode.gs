function onOpen() {
  var ui = SpreadsheetApp.getUi(), menu = ui.createMenu('Debt Snowball'), item = menu.addItem('Calculate PMT','debtSnowball'); item.addToUi();
  SpreadsheetApp.getActive().getSheetByName('Credit Cards').getRange('Snowball_PMT').setValue(0.00);
}
/**
 * Debt Snowball for the 15th PayCheck
 * @param {number[]} Sum of Debt SnowBall
 * @return {number} The total to pay.
 * @customfunction
*/
function payDebt15(Billpay){
  // Get today's date
  var today = new Date();
  var dayOfMonth = today.getDate();  
  //Determines which budget to use based on current date
  if (dayOfMonth >= 14) {
    // If yes, update 1st of the month DebtSnowball 
    return Billpay;
  } else {
    // If no, update 1st of the month DebtSnowball
    return 0;
  }
}
/**
 * Debt Snowball for the 1st PayCheck.
 * @param {number[]} Sum of Debt SnowBall.
 * @return {number} The total to pay.
 * @customfunction
*/
function payDebt(Billpay){
  // Get today's date
  var today = new Date();
  var dayOfMonth = today.getDate();  
  //Determines which budget to use based on current date
  if (dayOfMonth < 14) {
    // If yes, update 1st of the month DebtSnowball 
    return Billpay;
  } else {
    // If no, update 1st of the month DebtSnowball
    return 0;
  }
}
/**
 * Calculates Consolodated Bills for the month.
 * @param {number[]} Bill Array of bill amounts.
 * @param {number[]} Date Array of corresponding dates.
 * @param {number[]} Enter -15 for 1st Of Month or 15 for End of Month.
 * @return {number} The total bill amount for respective PayCheck.
 * @customfunction
*/
function calcExpense(Bill,Days,Flag){
  var billTotal = 0;
  //Ensure arrays have the same length
  if (Bill.length !== Days.length) {
    throw new Error("Arrays Bill and Days must have the same length");
  }
  if (Flag == 15){//Verify associated dates are for the MidMonth pay check. 
    for(var i = 0; i <= Bill.length; i++){
      if (Days[i] >= 15){
        billTotal += Number(Bill[i])
      }
    }return billTotal;
  }
  else{//Otherwise dates are for the First of the Month
    for(var i = 0; i <= Bill.length; i++){
      if (Days[i] < 15){
        billTotal += Number(Bill[i])
      }
    }return billTotal;
  }
} 
function sortDebts(arr1, arr2) {
  // Create an array of objects, each containing elements from both arrays
  var combinedArray = arr1.map(function (element, index) {
    return { key: element, value: arr2[index] };
  });
   // Filter and remove elements where the 'key' (arr1) is less than 1
  combinedArray = combinedArray.filter(function (obj) {
    return obj.key >= 1;
  });
  // Sort the array of objects based on the 'key' property (arr1)
  combinedArray.sort(function (a, b) {
    return a.key - b.key;
  });
  // Extract the sorted arrays
  var sortedArr1 = combinedArray.map(function (obj) {
    return obj.key;
  });
  var sortedArr2 = combinedArray.map(function (obj) {
    return obj.value;
  });
  return [sortedArr1, sortedArr2]
}
function debtSnowball() { 
  var snowBallPMT = ['i2','i3','i4','i5','i6','i7','i8','i9','i10','i11','i12','i13','i14','i15'];
  var ss = SpreadsheetApp.getActive(), mpb = ss.getSheetByName('Must Pay Bills'), bs = ss.getSheetByName('Budget Summary'), cc = ss.getSheetByName('Credit Cards');
  var budget1 = bs.getRange('b7').getValue(), budget15 = bs.getRange('b16').getValue(), ccDebts = cc.getRange('CC_Debts').getValues();
  var [sortedDebts, sortedPMT] = sortDebts(ccDebts, snowBallPMT), totalAllocated = 0, count = -1, allocation = [], recommend = []; 
  var balance = 0;
  // Get today's date
  var today = new Date();
  var dayOfMonth = today.getDate();  
  //Determines which budget to use based on current date
  if (dayOfMonth >= 14) {
    // If yes, use budget15  
    var cash = budget15*.75;
  } else {
    // If no, use budget1
    var cash = budget1*.75;
  }
  // Loop through debts 
  for (let debt of sortedDebts) {
    // Check if allocating the current expense exceeds 75% of the allotted budget
    if (Number(totalAllocated) + Number(debt) <= (cash)) {
      //Logger.log('Cash is: $'+ cash +'Debts is: $'+ debt);
      Logger.log(Number(totalAllocated) + Number(debt));
      count ++; //increment counter
      balance += Number(debt); //update the balance
      allocation.push(Number(debt)); //update the allocation array
      totalAllocated += Number(debt); //update the 
      recommend.push(sortedPMT[count]);
      //cc.getRange(recommend[count]).setValue(allocation[count]);    
      } else { 
         if(cash>debt){
            count ++; //increment counter
            balance += Number(debt); //update the balance
            allocation.push(Number(debt)); //update the allocation array
            totalAllocated += Number(debt); //update the 
            recommend.push(sortedPMT[count]);
            //cc.getRange(recommend[count]).setValue(allocation[count]);
            Logger.log('Cash is: $'+cash);
         }
          break;
          }
  }
}
