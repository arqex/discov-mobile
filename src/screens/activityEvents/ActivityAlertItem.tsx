import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { styleVars, Text, Wrapper, Touchable } from '../../components';
import { ActivityAlert, ActivityAlertLevel } from '../../services'
import { MaterialIcons } from '@expo/vector-icons';

interface ActivityAlertProps {
  alert: ActivityAlert,
  router: any
}

export default class ActivityAlertItem extends React.Component<ActivityAlertProps> {
  render() {
    let alert = this.props.alert;
    let containerStyles = [
      styles.container,
      styles[`container_${alert.level}`]
    ];
    return (
      <Touchable onPress={ () => this.props.router.navigate(alert.action) }>
        <View style={ containerStyles }>
          <Wrapper style={styles.row}>
            <View style={styles.icon}>
              <MaterialIcons
                size={30}
                color={ styleVars.colors.primary }
                name="new-releases" />
            </View>
            <Wrapper style={styles.texts}> 
              <Text type="title" color={ styleVars.colors.primary}>{ alert.title }</Text>
              <Text>{ alert.description }</Text>
            </Wrapper>
          </Wrapper>
        </View>
      </Touchable>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  [`container_${ActivityAlertLevel.ERROR}`]: {
    borderColor: styleVars.colors.primary,
    backgroundColor: '#fee'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginLeft: 6,
    marginRight: 16
  },
  texts: {
    flex: 1,
    maxWidth: styleVars.textWidth
  }
})