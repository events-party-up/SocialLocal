import * as db from './db'

export function getNotificationData(notifications) {

	let self = this;
  data_notify = [];
  notification_list = [];
  promises = []
  notifications.forEach(function(notification_data){
    
    if(notification_data.type !== "follow" ){
      if(notification_data.data.event.finished_at && notification_data.data.event.finished_at.timestamp > Date.now()){
        promises.push(db.getEventData(notification_data.data.eventId)
        .then((event)=> {
          if(event){
            notification_data_set=[];
            notification_data_set['event']=event;
            notification_data_set['eventId']=notification_data.data.eventId;
            notification_data_set['user']=notification_data.data.user;
            notification_data_set['type']=notification_data.type;
            notification_list.push(notification_data_set);
            data_notify.push(notification_data)
          return notification_data_set;
          }
          //self.setState({loaded: true,isListEmpty: false ,dataSource: ds.cloneWithRows(notification_list)})    
        }) )
        //.catch((e)=> console.log('error',e));

      }
    }
    else{
      promises.push(db.getUserByUid(notification_data.data.user.uid)
      .then((user)=>{
          notification_data_set=[];
          notification_data_set['user']=user;
          notification_data_set['type']=notification_data.type;
          notification_list.push(notification_data_set);
          data_notify.push(notification_data)
          return notification_data_set;
        }) )
    }
  });

  return Promise.all(promises)
  .then((data)=> {return( {notifications: data,notify: data_notify})} );
}