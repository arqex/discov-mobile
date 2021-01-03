const DataLoader = require('./dataLoader').default;
const ors = require('@arqex/ors');

describe('dataLoader', () => {
  let loader;
  let instance;
  let store;

  beforeEach( () => {
    store = ors({
      data: {id1: { value: 1 }}
    });
    loader = new DataLoader({
      getFromCache: id => store.data[id],
      loadData: id => {
        return new Promise( resolve => {
          setTimeout( () => {
            if( store.data[id] ){
              store.data[id].value = store.data[id].value + 1;
            }
            else {
              store.data[id] = { value: 1 };
            }
            resolve( store.data[id] );
          })
        })
      }
    });
    instance = {
      componentWillUnmount: jest.fn(),
      forceUpdate: jest.fn()
    }
  });

  describe('when the data is already loaded', () => {
    it('should return the data straight away', () => {
      let result = loader.getData( instance, 'id1' );
      expect( result ).toEqual({ error: false, isLoading: false, data: {value: 1} });
    });

    it('should re-render the instance when the data changes', done => {
      loader.getData( instance, 'id1');
      store.data.id1.value = 2;
      setTimeout( () => {
        expect( instance.forceUpdate ).toBeCalled();
        done();
      }, 20 )
    })

    it('shouldnt try to rerender after the instance is unmounted', done => {
      loader.getData( instance, 'id1');
      instance.componentWillUnmount();
      store.data.id1.value = 2;
      setTimeout( () => {
        expect( instance.forceUpdate ).not.toBeCalled();
        done();
      }, 20 )
    })
  });
})