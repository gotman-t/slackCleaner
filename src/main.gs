function main(){
  const channelNameList = [''];  // �폜�Ώۂ̃`�����l������ݒ�
  
  const last = 7; // �����O�܂ł̓��e���폜���邩��ݒ�
  const date = new Date();
  date.setDate(date.getDate - last);
  
  channelNameList.forEach(channel => clearSlack(channel, date));
}