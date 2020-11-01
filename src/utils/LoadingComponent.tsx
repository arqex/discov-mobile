import * as React from 'react';
import {Text} from 'react-native';
import { Bg } from '../components';

export interface SourceComponentProps {
  data: any,
  [otherKeys: string]: any
};

export interface LoadingMethods {
  needsLoad: (props: any, data: any) => any
  loadData: (props: any) => Promise<any>
  getData: (props: any) => any 
  renderLoading?: (props: any, data: any) => React.ReactElement
}

export function LoadingComponent( SourceComponent: React.ComponentClass<SourceComponentProps>, methods: LoadingMethods ){
  return class LoadingComponent extends React.Component {
    render(){
      const data = methods.getData( this.props );
      const needsLoad = methods.needsLoad( this.props, data );

      if( needsLoad ){
        return methods.renderLoading ?
          methods.renderLoading( this.props, data ) :
          this.renderDefaultLoading()
        ;
      }
      else {
        return (
          <SourceComponent { ...this.props } data={ data } />
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

    loading = false;
    checkLoad(){
      if( this.loading ) return;

      this.loading = true;
      methods.loadData( this.props )
        .finally( () => {
          this.loading = false;
          this.forceUpdate();
        })
      ;
    }

    componentDidMount() { this.checkLoad() }
    componentDidUpdate() { this.checkLoad() }
  }
}