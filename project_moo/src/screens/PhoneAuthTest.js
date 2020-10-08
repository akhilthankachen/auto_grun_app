import React, { useState } from 'react';
import { Button, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

function PhoneSignIn() {
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code).then( (user) =>{
        console.log(user)
      });
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  if (!confirm) {
    return (
        <SafeAreaView>
            <Button
                title="Phone Number Sign In"
                onPress={() => signInWithPhoneNumber('+91 8086432469')}
            />
        </SafeAreaView>
    );
  }

  return (
    <>
        <SafeAreaView>
            <TextInput value={code} onChangeText={text => setCode(text)} />
            <Button title="Confirm Code" onPress={() => confirmCode()} />
        </SafeAreaView>
    </>
  );
}

export default PhoneSignIn