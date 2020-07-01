import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity
} from 'react-native';

export default class Footer extends React.Component {

    render() {

        return (
            <KeyboardAvoidingView 
                style={styles.footer}
                behavior="position" 
                enabled={true}
            >
                <View style={styles.footerInner}>

                    <TouchableOpacity 
                        style={styles.btn}
                        onPress={ () => this.props.onNoteAdd() }
                    >
                        <Text style={styles.btnText}>+</Text>
                    </TouchableOpacity>

                    <TextInput 
                        style={styles.textInput}
                        placeholder={'Thêm thời gian'}
                        placeholderTextColor={'rgba(255, 255, 255, .7)'}
                        onChangeText={ (val) => this.props.onChangeText(val) }
                        value={this.props.inputValue}
                        keyboardType={'numeric'}
                        maxLength={5}
                    />
                </View>
            </KeyboardAvoidingView>
        );

    }

}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        width: '100%',
        height: 100,
        bottom: 0,
    },
    footerInner: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    btn: {
        zIndex: 1,
        position: 'absolute',
        right: 20,
        top: -20,
        width: 60,
        height: 60,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        backgroundColor: '#fa3664'
    },
    btnText: {
        color: '#fff',
        fontSize: 40,
    },
    textInput: {
        zIndex: 0,
        flex: 1,
        padding: 0,
        fontSize: 16,
        color: '#fff',
        backgroundColor: '#262526'
    }
});