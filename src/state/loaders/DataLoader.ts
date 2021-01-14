import { ReactInstance } from "react"

export default class DataLoader<T> {
  getFromCache: (id: string) => T
  isValid: (id: T) => boolean
  loadData: (id: string) => Promise<any>
  instances = new WeakMap()
  promises: {[key:string]: Promise<any>} = {}
  values: {[key:string]: DataLoaderResult<T>} = {}

  constructor( config: DataLoaderConfig<T> ){
    this.getFromCache = config.getFromCache;
    this.isValid = config.isValid || (() => true);
    this.loadData = config.loadData;
  }
  
  getData( instance: ReactInstance, id: string ){
    if( !this.isBound(instance, id) ){
      this.bindInstance(instance, id);
    }

    let value = this.values[id];
    if (value && value.error) {
      return value;
    }

    let cachedData = this.getFromCache( id );
    if( !cachedData || !this.isValid( cachedData ) ){
      this.handleDataLoading( id, instance );
      this.setValue(id, { error: false, isLoading: true, data: cachedData });
      return this.values[id];
    }

    this.setValue( id, { error: false, isLoading: false, data: cachedData });
    return this.values[id];
  }

  handleDataLoading( id, instance ){
    if( this.promises[id] ){
      this.promises[id].finally( () => instance.forceUpdate() );
    }

    this.promises[id] = this.loadData(id)
      .then(res => {
        delete this.promises[id];

        if (res.error) {
          let cachedData = this.getFromCache(id);
          this.setValue(id, { error: res.error, isLoading: false, data: cachedData });
        }
        else {
          this.setValue(id, { error: false, isLoading: false, data: res.data });
        }

        instance.forceUpdate();
        return res;
      })
      .catch( error => {
        let cachedData = this.getFromCache(id);
        this.setValue(id, { error: error, isLoading: false, data: cachedData });
      })
    ;
  }

  setValue( id: string, value: DataLoaderResult<T> ){
    let stored = this.values[id];
    if( !stored || stored.error !== value.error || stored.isLoading !== value.isLoading || stored.data !== value.data ){
      this.values[id] = value;
    }
    return this.values[id];
  }

  clearValue( id: string ){
    delete this.values[id];
  }

  isBound( instance, id ){
    let boundInstance = this.instances.get(instance);
    return boundInstance && boundInstance.id === id || false;
  }

  bindInstance( instance, id ){
    let boundInstance = this.instances.get(instance);
    if( boundInstance && boundInstance.id === id ) return;

    if( boundInstance ){
      let data = this.getFromCache( boundInstance.id );
      if( data ){
        // @ts-ignore: ors nodes are not well typed
        data.removeChangeListener( boundInstance.listener ); 
      }

      delete this.values[boundInstance.id];
      this.instances.delete( instance );
    }
    else {
      let originalUnmount = instance.componentWillUnmount;
      instance.componentWillUnmount = () => {
        let binding = this.instances.get(instance);
        let fromCache = this.getFromCache(binding.id);
        if (fromCache) {
          // @ts-ignore: ors nodes are not well typed
          fromCache.removeChangeListener(binding.listener);
        }
        delete this.values[binding.id];
        this.instances.delete(instance);
        if (originalUnmount) {
          originalUnmount.call(instance);
        }
      }
    }

    let fromCache = this.getFromCache( id );
    if( fromCache ){
      let binding = {
        id, listener: () => instance.forceUpdate()
      }
      this.instances.set(instance, binding);
      // @ts-ignore: ors nodes are not well typed
      fromCache.addChangeListener( binding.listener )
    }
    
  }
}