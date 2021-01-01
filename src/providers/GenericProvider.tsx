import * as React from 'react';
import Bg from '../components/Bg';
import Text from '../components/Text';
import ConnectionContext from '../utils/ConnectionContext';

export interface GenericProviderMethods {
  getId: (props: any) => string
  getPropName?: () => string
  getData: (props: any, id: string) => any
  needsLoad: (props: any) => boolean
  loadData: (props: any, id: string) => Promise<any>
  renderLoading?: (props: any, data: any) => React.ReactElement
}

export function GenericProvider( WrappedComponent, methods: GenericProviderMethods ){
  return class Provider extends React.Component {
    static contextType = ConnectionContext.Context
    getPropName = methods.getPropName || (() => 'data');
    render() {
      const data = methods.getData( this.props, methods.getId( this.props ) );
      const isConnected = this.context.isConnected;

      if( isConnected && methods.needsLoad( this.props ) ){
        return methods.renderLoading ?
          methods.renderLoading( this.props, data ) :
          this.renderDefaultLoading()
        ;
      }
      else {
        return (
          <WrappedComponent
            { ...this.props }
            isConnected={ this.context.isConnected }
            { ...{[this.getPropName()]: data} } />
        );
      }
    }

    renderDefaultLoading() {
      return (
        <Bg>
          <Text>Loading</Text>
        </Bg>
      );
    }

    onEffect() {
      this.checkSubscription();
      this.checkLoad();
    }

    componentDidMount() { this.onEffect() }
    componentDidUpdate() { this.onEffect() }

    loading = false;
    checkLoad(){
      if( !this.context.isConnected ) return;
      
      let id = methods.getId(this.props);
      if( this.loading || !methods.needsLoad( this.props ) ) return;
      
      this.loading = true;
      methods.loadData( this.props, id )
        .finally( () => {
          this.loading = false;
          this.forceUpdate();
        })
      ;
    }

    lastId = '';
    lastData: any = false;
    subscribed = false;
    checkSubscription() {
      const id = methods.getId( this.props );
      if( id !== this.lastId ) return;

      if( this.lastData ){
        this.lastData.removeChangeListener( this._onDataChange );
        this.lastData = false;
      }

      const data = methods.getData( this.props, id );
      if( data ){
        data.addChangeListener( this._onDataChange );
        this.lastId = id;
        this.lastData = data;
      }
    }

    _onDataChange = () => this.forceUpdate()

    componentWillUnmount() {
      if( this.lastData ){
        this.lastData.removeChangeListener( this._onDataChange );
      }
    }

    shouldComponentUpdate( nextProps ){
      let nextId = methods.getId( nextProps );
      if( nextId !== this.lastId ) return true;

      let nextData = methods.getData( nextProps, nextId );
      return nextData !== this.lastData;
    }
  }
}