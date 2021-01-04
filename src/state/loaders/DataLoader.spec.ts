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

  describe( 'getData(instance, id)', () => {
    describe('when the data is already loaded', () => {
      it('should return the data straight away', () => {
        let result = loader.getData(instance, 'id1');
        expect(result).toEqual({ error: false, isLoading: false, data: { value: 1 } });
      });

      it('should re-render the instance when the data changes', done => {
        loader.getData(instance, 'id1');
        store.data.id1.value = 2;
        setTimeout(() => {
          expect(instance.forceUpdate).toBeCalled();
          done();
        }, 20)
      })

      it('shouldnt try to rerender after the instance is unmounted', done => {
        loader.getData(instance, 'id1');
        instance.componentWillUnmount();
        store.data.id1.value = 2;
        setTimeout(() => {
          expect(instance.forceUpdate).not.toBeCalled();
          done();
        }, 20)
      })

      it('should unsubscribe from one id after getting the value of other', done => {
        store.data.id2 = { value: 2 };
        loader.getData(instance, 'id1');
        loader.getData(instance, 'id2');
        store.data.id1.value = 2;
        setTimeout(() => {
          expect(instance.forceUpdate).not.toBeCalled();
          done();
        }, 20);
      })

      describe('and the cached data is not valid', () => {
        it('should return the current data and load it again', done => {
          loader.isValid = () => false
          let result = loader.getData(instance, 'id1');
          expect(result).toEqual({error:false, isLoading: true, data: {value: 1}})
          setTimeout( () => {
            loader.isValid = () => true
            let result = loader.getData(instance, 'id1');
            expect(result).toEqual({ error: false, isLoading: false, data: { value: 2 } })
            done();
          },20)
        })
      })
    });

    describe('when the data is not in the cache', () => {
      it('should return loading after requesting the data', () => {
        let result = loader.getData(instance, 'id2');
        expect(result).toEqual({ error: false, isLoading: true, data: undefined });
      });

      it('should return the data after loading', done => {
        loader.getData(instance, 'id3');
        setTimeout(() => {
          let result = loader.getData(instance, 'id3');
          expect(result).toEqual({ error: false, isLoading: false, data: { value: 1 } });
          done()
        }, 20)
      })

      it('should re-render the component after loading', done => {
        loader.getData(instance, 'id4');
        setTimeout(() => {
          expect(instance.forceUpdate).toBeCalled()
          done()
        }, 20)
      })

      it('should return the error if the loadData returns any', done => {
        loader.loadData = () => Promise.resolve({ error: 'Dummy Error' });
        loader.getData(instance, 'id5');
        setTimeout(() => {
          let result = loader.getData(instance, 'id5');
          expect(result).toEqual({ error: 'Dummy Error', isLoading: false, data: undefined });
          done();
        }, 20)
      })
    })
  })
})