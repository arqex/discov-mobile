import * as React from 'react';
import {Text} from 'react-native';
import { Bg } from '../components';

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
    getPropName = methods.getPropName || (() => 'data');
    render() {
      const data = methods.getData( this.props, methods.getId( this.props ) );
      const needsLoad = methods.needsLoad( this.props );


      if( needsLoad ){
        return methods.renderLoading ?
          methods.renderLoading( this.props, data ) :
          this.renderDefaultLoading()
        ;
      }
      else {
        return (
          <WrappedComponent { ...this.props }
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