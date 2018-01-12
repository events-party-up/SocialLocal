
/**************      For All Searchable Lists  ********************* 
  
  dataItems will be generic for users or events or places for future reference
  It should make distinction of users or events or places inside and return the object accordingly.
  Make sure all lists input params has suggestions object 
  *****************************************************************/


export function filterSearchData(dataItems, searchText){
  if(searchText === undefined || searchText.length <= 1){
    return {'SUGGESTED': dataItems.suggestions};
  }
  let text = searchText.toLowerCase();
  return {'Search Results': _.filter(dataItems.suggestions, (item) => {
    const{searchable_param1, searchable_param2 } = differentiateItemAndGetSearchableParams(item);
    return (searchable_param1 && searchable_param1.toLowerCase().search(text) !== -1 ) 
      || (searchable_param2 && searchable_param2.toLowerCase().search(text) !== -1 );
  })};
}

export function filterSearchDataFindContactPageOptions(dataItems, searchText){
  
  if(searchText === undefined || searchText.length < 1){
    return dataItems;
  }

  let text = searchText.toLowerCase();
  return {'registered': _.filter(dataItems.registered, (item) => {
    const{searchable_param1, searchable_param2 } = getContactSearchableParams(item);
    return (searchable_param1 && searchable_param1.toLowerCase().search(text) !== -1 ) 
      || (searchable_param2 && searchable_param2.toLowerCase().search(text) !== -1 );
  }), 'add contacts': _.filter(dataItems['add contacts'], (item)=>{
    const{searchable_param1, searchable_param2 } = getContactSearchableParams(item);
    return (searchable_param1 && searchable_param1.toLowerCase().search(text) !== -1 ) 
      || (searchable_param2 && searchable_param2.toLowerCase().search(text) !== -1 );
  })};
}

function getContactSearchableParams(item){
  return { searchable_param1: _.get(item,'givenName'), searchable_param2: _.get(item,'familyName')};
}

function differentiateItemAndGetSearchableParams(item){
  if(_.get(item, 'uid')){
    return { searchable_param1: _.get(item,'name') , searchable_param2: _.get(item,'username')};
  }
  //use this for event, if second param is null then just pass the empty value but in that case
  // first param should always be available
  else if(false){ 
    return {searchable_param1: '', searchable_param2: ''};
  }
}

export function filterContactSearch(dataItems, searchText){
  if(searchText === undefined || searchText.length <= 1){
    return dataItems;
  }
  let text = searchText.toLowerCase();
  return  _.filter(dataItems, (item) => {
    const{searchable_param1 } = differentiateContactAndGetSearchableParams(item);
    return (searchable_param1 && searchable_param1.toLowerCase().search(text) !== -1 );
  });
}

function differentiateContactAndGetSearchableParams(item){
  if(_.get(item, 'uid')){
    return { searchable_param1: _.get(item,'givenName')};
  }
  //use this for event, if second param is null then just pass the empty value but in that case
  // first param should always be available
  else if(false){ 
    return {searchable_param1: '', searchable_param2: ''};
  }
}


