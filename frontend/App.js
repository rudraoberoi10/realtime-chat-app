import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, Platform, SafeAreaView 
} from 'react-native';
import { io } from 'socket.io-client';

// Development server URL. 
// TODO: Move to a .env file before production deployment.
const SERVER_URL = 'http://YOUR_IP_ADDRESS_HERE'; 

export default function App() {
  const [username, setUsername] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SERVER_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    // Listen for broadcasted messages
    socketRef.current.on('receive_message', (incomingMessage) => {
      setChatHistory((prevHistory) => [...prevHistory, incomingMessage]);
    });

    // Cleanup on unmount to prevent memory leaks
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleJoinChat = () => {
    if (username.trim().length > 0) {
      setHasJoined(true);
    }
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() === '') return;

    const messageData = {
      username: username,
      text: currentMessage,
    };

    socketRef.current.emit('send_message', messageData);
    setCurrentMessage(''); // Reset input field after sending
  };

  // --- Render Helpers ---

  // Extracts the message UI to keep the main return block clean
  const renderMessage = ({ item }) => {
    const isMyMessage = item.username === username;
    return (
      <View style={[styles.messageBubble, isMyMessage ? styles.myBubble : styles.theirBubble]}>
        {!isMyMessage && <Text style={styles.senderName}>{item.username}</Text>}
        <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : {}]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  // --- Main Renders ---

  // 1. Authentication View
  if (!hasJoined) {
    return (
      <SafeAreaView style={styles.authContainer}>
        <View style={styles.card}>
          <Text style={styles.headerTitle}>Welcome to Chat</Text>
          <Text style={styles.subtitle}>Enter a username to join the room</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="e.g., JaneDoe" 
            value={username} 
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.primaryButton} onPress={handleJoinChat}>
            <Text style={styles.buttonText}>Join Room</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Main Chat View
  return (
    <SafeAreaView style={styles.chatContainer}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Public Room</Text>
          <Text style={styles.activeUserText}>Logged in as {username}</Text>
        </View>

        <FlatList
          data={chatHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.chatInput} 
            placeholder="Type your message..." 
            value={currentMessage} 
            onChangeText={setCurrentMessage} 
            multiline={false}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !currentMessage.trim() && styles.sendButtonDisabled]} 
            onPress={handleSendMessage}
            disabled={!currentMessage.trim()}
          >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Authentication Screen Styles
  authContainer: { flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', padding: 24, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 16, backgroundColor: '#F9FAFB' },
  primaryButton: { backgroundColor: '#3B82F6', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  
  // Chat Screen Styles
  chatContainer: { flex: 1, backgroundColor: '#F9FAFB' },
  keyboardView: { flex: 1 },
  header: { padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', alignItems: 'center' },
  headerText: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  activeUserText: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  listContent: { padding: 16 },
  
  // Message Bubble Styles
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 12 },
  myBubble: { alignSelf: 'flex-end', backgroundColor: '#3B82F6', borderBottomRightRadius: 4 },
  theirBubble: { alignSelf: 'flex-start', backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB', borderBottomLeftRadius: 4 },
  senderName: { fontSize: 12, fontWeight: '600', color: '#4B5563', marginBottom: 4 },
  messageText: { fontSize: 15, color: '#1F2937' },
  myMessageText: { color: 'white' },
  timestamp: { fontSize: 10, marginTop: 6, alignSelf: 'flex-end', opacity: 0.7, color: '#9CA3AF' },
  
  // Input Area Styles
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  chatInput: { flex: 1, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, marginRight: 12 },
  sendButton: { backgroundColor: '#3B82F6', borderRadius: 20, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: '#9CA3AF' } // Greys out the button if text is empty
});