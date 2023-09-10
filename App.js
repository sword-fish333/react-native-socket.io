import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Image, View, Text, Button, ScrollView} from 'react-native';
import Echo from 'laravel-echo';
import io from 'socket.io-client';
import {useEffect, useState} from "react";

// Assuming your Laravel app is hosted on 'cryptoexcellence.club'
const host = process.env.EXPO_PUBLIC_HOST
const port =  process.env.EXPO_PUBLIC_PORT
const protocol = process.env.EXPO_PUBLIC_PROTOCOL
const socket = io(`${protocol}://${host}:${port}`);

export default function App() {
    const [trading_signal,setTradingSignal]=useState(null)
    useEffect(() => {

        const echo = new Echo({
            broadcaster: 'socket.io',
            host: `${protocol}://${host}:${port}`,
            client: io,
        });

        const channel = echo.channel('trading-signal');
        channel.listen('TradingSignalEvent', e => {
            console.log('Received trading signal:', e.trading_signal);
            if(e.trading_signal){
                setTradingSignal(e.trading_signal)
            }
        });
        echo.connector.socket.on('connect', () => {
            console.log('Successfully connected.');
        });

        echo.connector.socket.on('connect_error', (error) => {
            console.error('Error Message:', error.message);
        });
        // Cleanup function
        return () => {
            console.log('stopListening')
            channel.stopListening('TradingSignalEvent');
            echo.disconnect();
        };
    }, []);
    const sendSignal=()=>{
    console.log('sendSignal')
        socket.emit('trading-signal', {
            event: 'TradingSignalEvent',
            data: 'Your trading signal data here'
        });
    }
    return (
        <View style={styles.container}>
            <Image
                style={{width:100, height:100,marginTop:50,resizeMode:'contain'}}
                source={require('./assets/images/logo_socket_io.png')}
            />
            {trading_signal && <ScrollView style={{maxHeight:'70%',marginTop:10}}><Text style={{
                fontFamily: 'monospace', // This will give a more "code-like" appearance
                fontSize: 14,}}>
                {JSON.stringify(trading_signal, null, 2)}
            </Text></ScrollView>}
            <View  style={{position:'absolute',bottom:0,width:'80%',marginTop:30,marginBottom:30}}>
            <Button title={'send signal'} onPress={sendSignal}/>
            </View>
          <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom:30
    },
});
