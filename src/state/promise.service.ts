let promises = {};

export default {
  get( promiseKey ){
    return promises[ promiseKey ];
  }
  
}