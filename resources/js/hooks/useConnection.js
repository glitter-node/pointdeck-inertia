import { useEffect, useRef, useState } from 'react';

function mapConnectionState(state) {
    if (state === 'connected') {
        return 'connected';
    }

    if (state === 'connecting' || state === 'unavailable') {
        return 'reconnecting';
    }

    return 'disconnected';
}

export default function useConnection() {
    const connector = window.Echo?.connector?.pusher;
    const connection = connector?.connection;
    const initialState = connection?.state ?? 'disconnected';
    const hasConnectedRef = useRef(initialState === 'connected');
    const [status, setStatus] = useState(mapConnectionState(initialState));
    const [reconnectVersion, setReconnectVersion] = useState(0);

    useEffect(() => {
        if (!connection) {
            setStatus('disconnected');

            return undefined;
        }

        const handleStateChange = ({ current }) => {
            setStatus(mapConnectionState(current));
        };

        const handleConnected = () => {
            setStatus('connected');

            if (hasConnectedRef.current) {
                setReconnectVersion((current) => current + 1);
            } else {
                hasConnectedRef.current = true;
            }
        };

        const handleDisconnected = () => {
            setStatus('disconnected');
        };

        const handleUnavailable = () => {
            setStatus('reconnecting');
        };

        connection.bind('state_change', handleStateChange);
        connection.bind('connected', handleConnected);
        connection.bind('disconnected', handleDisconnected);
        connection.bind('unavailable', handleUnavailable);

        return () => {
            connection.unbind('state_change', handleStateChange);
            connection.unbind('connected', handleConnected);
            connection.unbind('disconnected', handleDisconnected);
            connection.unbind('unavailable', handleUnavailable);
        };
    }, [connection]);

    return {
        connected: status === 'connected',
        disconnected: status === 'disconnected',
        reconnecting: status === 'reconnecting',
        reconnectVersion,
    };
}
