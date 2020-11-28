function main(){
  const channelNameList = [''];  // íœ‘ÎÛ‚Ìƒ`ƒƒƒ“ƒlƒ‹–¼‚ðÝ’è
  
  const last = 7; // ‰½“ú‘O‚Ü‚Å‚Ì“Še‚ðíœ‚·‚é‚©‚ðÝ’è
  const date = new Date();
  date.setDate(date.getDate - last);
  
  channelNameList.forEach(channel => clearSlack(channel, date));
}