export default function augmentRouter( router ){
  router.back = function(){
    let backRoute;

    if( this.modal.active ){
      if( this.modal.activeIndex > 0 ){
        backRoute = this.modal.stack[ this.modal.activeIndex - 1 ];
      }
      else {
        backRoute = getRoute( this.stack, this.activeIndex );
      }
    }

    else if( this.activeIndex > 0 ){
      backRoute = getRoute( this.stack, this.activeIndex - 1);
    }

    if( backRoute ){
      this.navigate( backRoute.path );
      return true;
    }

    return false;
  }

  router.closeModal = function() {
    if( this.modal.active ){
      this.navigate( getRoute( this.stack, this.activeIndex ).path );
    }
  }
}


function getRoute( stack, index ){
  let route = stack[index];
  if( route.isTabs ){
    return route.tabs.stack[ route.tabs.activeIndex ];
  }
  return route;
}