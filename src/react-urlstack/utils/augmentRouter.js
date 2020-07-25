export default function augmentRouter( router ){
  router.back = function(){
    let backRoute;

    if( this.modal.active ){
      if( this.modal.activeIndex > 0 ){
        backRoute = this.modal.stack[ this.modal.activeIndex - 1 ];
      }
      else {
        backRoute = this.stack[ this.activeIndex ];
      }
    }
    else if( this.activeIndex > 0 ){
      backRoute = this.stack[ this.activeIndex - 1 ];
    }

    if( backRoute ){
      this.navigate( backRoute.path );
      return true;
    }

    return false;
  }

  router.closeModal = function() {
    if( this.modal.active ){
      this.navigate( this.stack[ this.activeIndex ].path );
    }
  }
}