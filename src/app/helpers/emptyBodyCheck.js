export function IsEmptyOrUndefined(jsonObject) {
if(jsonObject === undefined || Object.keys(jsonObject).length === 0){
    return true
  } else {
      return false
  }
}