import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import i18n from '../lang/i18n';
import UserService from '../services/UserService';
import Master from './Master';

export default function AboutScreen({ navigation, route }) {
    const isFocused = useIsFocused();
    const [reload, setReload] = useState(false);
    const [visible, setVisible] = useState(false);

    const _init = async () => {
        setVisible(false);
        const language = await UserService.getLanguage();
        i18n.locale = language;
        setVisible(true);
    };

    useEffect(() => {
        if (isFocused) {
            _init();
            setReload(true);
        } else {
            setVisible(false);
        }
    }, [route.params, isFocused]);

    const onLoad = (user) => {
        setReload(false);
    };

    return (
        <Master style={styles.master} navigation={navigation} route={route} onLoad={onLoad} reload={reload}>
            {visible &&
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                >
                    <Text style={{ fontSize: 16 }}>About!</Text>
                </ScrollView>
            }
        </Master>
    );
}

const styles = StyleSheet.create({
    master: {
        flex: 1
    },
    container: {
        flexGrow: 1,
        alignItems: 'center'
    }
});