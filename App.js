import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Image, View, Button} from 'react-native';
import Echo from 'laravel-echo';
import io from 'socket.io-client';
import {useEffect} from "react";

const socket = io(`${protocol}://${host}:${port}`);
// Assuming your Laravel app is hosted on 'cryptoexcellence.club'
const host = 'cryptoexcellence.club';
const port = 6001;
const protocol = 'wss'; // 'wss' for SSL

export default function App() {
    useEffect(() => {

        const echo = new Echo({
            broadcaster: 'socket.io',
            host: `${protocol}://${host}:${port}`,
            client: io,
        });

        const channel = echo.channel('trading-signal');
        channel.listen('TradingSignalEvent', e => {
            console.log('Received trading signal:', e);
        });
        echo.connector.socket.on('connect', () => {
            console.log('Successfully connected.');
        });


        echo.connector.socket.on('error', (error) => {
            console.error('Error:', error);
        });

        echo.connector.socket.on('connect_error', (error) => {

            // Print the error message
            console.error('Error Message:', error.message);


        });
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('error', (error) => {
            console.error('Error:', error);
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
                style={{width:300,height:300}}
                source={require('./assets/images/logo_socket_io.png')}
            />
            <View  style={{width:'80%',marginTop:50}}>
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
        justifyContent: 'center',
    },
});
