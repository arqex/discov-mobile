
interface DataLoaderConfig {
  getFromCache: (id: string) => any
  isValid?: (data: any) => boolean
  loadData: (id: string) => Promise<any>
}

interface DataLoaderResult {
  error: any
  isLoading: boolean
  data: any
}

export default class DataLoader {
  getFromCache: (id: string) => any
  isValid: (id: any) => boolean
  loadData: (id: string) => Promise<any>
  instances = new WeakMap()
  originalUnmount: any
  onUnmount: any
  promises: {[key:string]: Promise<any>} = {}
  values: {[key:string]: DataLoaderResult} = {}

  constructor( config: DataLoaderConfig ){
    this.getFromCache = config.getFromCache;
    this.isValid = config.isValid || (() => true);
    this.loadData = config.loadData;
  }
  
  getData( instance, id ){
    if( !this.isBound(instance, id) ){
      this.bindInstance(instance, id);
    }

    let cachedData = this.getFromCache( id );
    if( !cachedData || !this.isValid( cachedData ) ){
      let value = this.values[id];
      if (value && value.error) {
        return value;
      }
      
      if( !this.promises[id] ){
        this.promises[id] = this.loadData( id ).then( res => {
          delete this.promises[id];
          if( res.error ){
            this.setValue( id, { error: res.error, isLoading: false, data: cachedData });
          }
          else {
            this.setValue(id, { error: false, isLoading: false, data: res.data });
          }
          instance.forceUpdate();
        });
      }

      this.setValue( id, { error: false, isLoading: true, data: cachedData });
      return this.values[id];
    }

    this.setValue( id, { error: false, isLoading: false, data: cachedData });
    return this.values[id];
  }

  setValue( id: string, value: DataLoaderResult ){
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
        data.removeChangeListener( boundInstance.listener );
      }

      delete this.values[boundInstance.id];
      this.instances.delete( instance );
    }

    let fromCache = this.getFromCache( id );
    if( fromCache ){
      let binding = {
        id, listener: () => instance.forceUpdate()
      }
      this.instances.set( instance, binding );
      fromCache.addChangeListener( binding.listener )
    }

    if( !this.onUnmount ){
      let originalUnmount = instance.componentWillUnmount;
      instance.componentWillUnmount = () => {
        let binding = this.instances.get( instance );
        let fromCache = this.getFromCache( binding.id );
        if( fromCache ){
          fromCache.removeChangeListener( binding.listener );
        }
        delete this.values[binding.id];
        this.instances.delete( instance );
        originalUnmount.call( instance );
      }
    }
  }
}