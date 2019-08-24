import React from 'react'
import { Header, Button } from 'react-native-elements'
import { View, Modal, FlatList, TouchableOpacity } from 'react-native'
import styles, {Colors} from '../styles/Styles'
import { ScrollView } from 'react-native-gesture-handler'

/*
  DESCRIPTION:
    A dropdown style component that when opened, brings up a popup modal with a 
    scrolable list (alphabetized). on selection, close the popup and update selected value

  PROPS:
    returnValue : Expects a funtion that will be executed on selection of an option
                  from the dropdown with the option as a paramater

                  (Example
                    In Class...
                    getSelectorArea = (area) => {
                      this.setState({ selectedArea: area })
                    }

                    In render...
                    <Selector returnValue={this.getSelectorArea}/>

                    When an option from the dropdown is selected, the parents selectedArea
                    from the state will be updated
                  )

    type : Type of thing being selected (eg. area, product, location)

    options : Expects an array of Strings do be displayed in the dropdown                




*/
export default class Selector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { popupVisible: false }
  }

  static navigationOptions = {
    header: null
  }

  togglePopup() {
    this.setState({ popupVisible: !this.state.popupVisible });
  }

  valueSelected = (option) => {
    this.setState({ selected: option }, () => {
      this.props.returnValue(option)
      this.togglePopup()
    })

  }

  addOption = (option) => {
    let textColor, buttonColor
    textColor = option==this.state.selected?'black':'grey'
    buttonColor = option==this.state.selected?'grey':'#FFF'
    return ( //Return button
      <View style={{...styles.buttonBlock, borderBottomWidth: 0, width:'95%'}}>
        {/* name button after part name and pass this part to onclick function */}
        <Button title={option} buttonStyle={{ backgroundColor: buttonColor, borderColor:'grey', borderWidth:1 }} titleStyle={{color:textColor}} type="solid" onPress={() => { this.valueSelected(option) }} />
      </View>
    )
  }

  render() {

    //Get products, sort alphabetically
    let options = this.props.options
    options = options.sort((a,b)=> a > b)

    let pickerMessage = ""
    if(this.state.selected){
      pickerMessage = this.state.selected
    }
    else if (this.props.type) {
      pickerMessage = "Choose " + this.props.type
    } else {
      pickerMessage = "Choose Option"
    }
    return (<View style={{ width: '100%', height: '100%' }}>
      <Header containerStyle={{ borderWidth: 0.5, borderColor: '#EEE', height: 40, paddingTop: 0, backgroundColor: 'white' }}
        centerComponent={{ text: pickerMessage, style: { fontSize: 20, color: 'grey', fontWeight: 'bold' } }}
        rightComponent={{ icon: "arrow-drop-down", color: 'grey', onPress: () => this.togglePopup() }}
      ></Header>

      <Modal
        visible={this.state.popupVisible}
        animationType='slide'
        transparent={true}
      >
        <View style={styles.fadedBackdrop}>
          <View style={{ ...styles.popupBox }}>
          <View style={{ ...styles.block, width:'80%', paddingBottom:100}}>

            <ScrollView>
              <FlatList
                data={options}
                renderItem={({ item }) => (
                  { ...this.addOption(item) }
                )}
                //Setting the number of column
                numColumns={1}
                keyExtractor={(item, index) => item}
              />
            </ScrollView>
            </View>
            {/* Button for if use accidentally clicked */}
            <View style={{ position: "absolute", bottom: 15, width: 200 }}>
              <TouchableOpacity style={{ ...styles.buttonHover, color: Colors.BLUE }}>
                <Button title="Oops Go Back!" onPress={() => { this.togglePopup() }} buttonStyle={{ backgroundColor: Colors.BLUE }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    )
  }

}
