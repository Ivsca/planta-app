import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function GameScreen() {
  // TODO: Reemplazar esta URL con la URL de tu juego WebGL hosteado
  const GAME_URL = 'https://play.unity.com/en/games/943c08ce-733e-4926-80c5-cad674edae5d/unitygame';

  // Mostrar mensaje en web (solo funciona en Android/iOS)
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>🎮 El oraculo</Text>
        </View>
        <View style={styles.webNotSupported}>
          <Text style={styles.webNotSupportedTitle}>Juego disponible solo en móvil mi amor</Text>
          <Text style={styles.webNotSupportedText}>
            Para jugar, abre esta app en un dispositivo Android o iOS.
          </Text>
          <Text style={styles.webNotSupportedHint}>
            Ejecuta: npm run android bobito
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🎮 El oraculo</Text>
      </View>
      
      <WebView
        source={{ uri: GAME_URL }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Cargando juego...</Text>
          </View>
        )}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsFullscreenVideo={true}
        mixedContentMode="always"
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  webNotSupported: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webNotSupportedTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  webNotSupportedText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  webNotSupportedHint: {
    color: '#4CAF50',
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
